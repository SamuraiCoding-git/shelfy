import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from "axios";
import { format, parseISO } from 'date-fns';

// Mock API Service
const apiService = {
    getTodos: async () => {
        try {
            const response = await axios.post(
                'https://2ff1-192-36-61-126.ngrok-free.app/api/todos/all',
                { userInitData: window.Telegram.WebApp.initData },
                {
                    headers: {
                        'ngrok-skip-browser-warning': 'true',
                        'Content-Type': 'application/json'
                    }
                }
            );
            if (response.data && response.data.todos) {
                return response.data.todos;
            } else {
                console.error('Invalid API response format');
                return [];
            }
        } catch (error) {
            console.error('Error fetching todos:', error);
            return [];
        }
    },
    addTodo: async (todo) => {
        console.log(todo)
        try {
            const response = await axios.post(
                'https://2ff1-192-36-61-126.ngrok-free.app/api/todos/',
                {
                    todoData: todo, // Send todoData in the request body
                    userInitData: window.Telegram.WebApp.initData
                },
                {
                    headers: {
                        'ngrok-skip-browser-warning': 'true',
                        'Content-Type': 'application/json'
                    }
                }
            );
            if (response.data && response.data.todo) {
                return response.data.todo; // Return the created todo from the API response
            } else {
                console.error('Invalid API response format');
                return null;
            }
        } catch (error) {
            console.error('Error creating todo:', error);
            return null;
        }
    },
    deleteTodo: async (userId, todoId) => {
        // Simulate API request for deleting a todo
        console.log(`Deleting todo with ID ${todoId} for user ${userId}`);
    },
    editTodo: async (userId, updatedTodo) => {
        // Simulate API request for editing a todo
        console.log(`Editing todo with ID ${updatedTodo.id} for user ${userId}:`, updatedTodo);
    },
    toggleTodoStatus: async (todoId) => {
        try {
            const response = await axios.patch(
                `https://2ff1-192-36-61-126.ngrok-free.app/api/todos/${todoId}/toggle_status`,
                { userInitData: window.Telegram.WebApp.initData },
                {
                    headers: {
                        'ngrok-skip-browser-warning': 'true',
                        'Content-Type': 'application/json'
                    }
                }
            );
            if (response.data && response.data.updated_todo) {
                return response.data.updated_todo;
            } else {
                console.error('Invalid API response format');
                return null;
            }
        } catch (error) {
            console.error('Error toggling todo status:', error);
            return null;
        }
    }
};


// Mock Telegram Service
const tgService = {
    getUserId: () => window.Telegram.WebApp.initDataUnsafe.user.id, // Simulate getting user ID
};

// Create Context
const TodoContext = createContext();

// TodoProvider Component
export const TodoProvider = ({ children }) => {
    const [allTodos, setAllTodos] = useState([]);
    const [filteredTodos, setFilteredTodos] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null); // Keep track of selected date

    // Load initial todos
    useEffect(() => {
        const loadInitialTodos = async () => {
            try {
                const todos = await apiService.getTodos();
                setAllTodos(todos || []);
                updateFilteredTodos(todos || [], selectedDate); // Apply initial filtering
            } catch (error) {
                setAllTodos([])
                updateFilteredTodos([], selectedDate);
            }
        };
        loadInitialTodos();
    }, []); // Only load todos once on mount

    // Update filtered todos based on the selected date
    useEffect(() => {
        updateFilteredTodos(allTodos, selectedDate);
    }, [selectedDate, allTodos]);

    // Function to filter todos by the selected date
    const updateFilteredTodos = (todos, date) => {
        if (!date) {
            setFilteredTodos(todos); // If no date is selected, show all todos
            return;
        }

        // Convert the input date to YYYY-MM-DD format
        const formattedDate = format(new Date(date), 'yyyy-MM-dd');

        const filtered = todos.filter((todo) => {
            // Ensure todo.date is a valid date string before parsing
            if (!todo.date) return false;
            console.log(formattedDate)
            // Parse the todo.date and remove the time component
            const todoDate = format(parseISO(todo.date), 'yyyy-MM-dd');
            return todoDate === formattedDate;
        });

        setFilteredTodos(filtered);
    };

    // Add a new todo
    const addTodo = async (todo) => {
        const newTodo = { ...todo, todo_id: allTodos.length + 1, status: false };
        const updatedTodos = [...allTodos, newTodo];
        setAllTodos(updatedTodos);

        console.log(newTodo)

        // Call API to add the new todo
        const createdTodo = await apiService.addTodo(newTodo);
        if (createdTodo) {
            setAllTodos([...allTodos, createdTodo]); // Add the newly created todo to the state
            updateFilteredTodos(updatedTodos, selectedDate); // Update filtered todos after adding
        }
    };

    // Create a new task with additional details
    const createTask = async (title, description, dueDate, reminder, dueTime, reminderTime, tags, repeat) => {
        const tagIds = tags.map(tag => tag.tag_id);

        const newTask = {
            todo_id: allTodos.length + 1, // Generate a new ID
            title: title,
            description: description,
            reminder: reminder,
            date: new Date(dueDate),
            time: dueTime,
            reminderTime: reminderTime,// Convert dueDate to ISO string for 'time'
            status: false, // Task is initially not completed
            repeat: repeat, // Repeat value for the task
            tags: tagIds, // Tags for the task
        };

        const updatedTodos = [...allTodos, newTask];
        setAllTodos(updatedTodos);
        updateFilteredTodos(updatedTodos, selectedDate);
        await apiService.addTodo(newTask);// Update filtered todos after creating a task
    };

    // Toggle todo status (completed / not completed)
    const toggleTodoStatus = async (todo_id) => {
        const updatedTodos = allTodos.map((todo) =>
            todo.todo_id === todo_id ? { ...todo, status: !todo.status } : todo
        );
        setAllTodos(updatedTodos);
        updateFilteredTodos(updatedTodos, selectedDate);
        await apiService.toggleTodoStatus(todo_id)
    };

    // Delete a todo by ID
    const deleteTodo = async (todo_id) => {
        try {
            const updatedTodos = allTodos.filter((todo) => todo.todo_id !== todo_id);
            setAllTodos(updatedTodos);
            updateFilteredTodos(updatedTodos, selectedDate); // Update filtered todos after deletion
            await apiService.deleteTodo(tgService.getUserId(), todo_id); // Call API to simulate deletion
            console.log(`Todo with ID ${todo_id} deleted`);
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    // Edit a todo by ID
    const editTodo = async (updatedTodo) => {
        try {
            // Assuming you have a way to update the tasks in the state
            const updatedTodos = allTodos.map((todo) =>
                todo.id === updatedTodo.id ? { ...todo, ...updatedTodo } : todo
            );
            setAllTodos(updatedTodos); // Update the todos state with the edited task
            updateFilteredTodos(updatedTodos, selectedDate); // Update the filtered todos (if any)

            // Simulate API call for editing the task
            await apiService.editTodo(tgService.getUserId(), updatedTodo);
            console.log(`Todo with ID ${updatedTodo.id} edited`);
        } catch (error) {
            console.error('Error editing todo:', error);
        }
    };

    // Get count of filtered todos (e.g., for display)
    const getTodosCount = () => filteredTodos.length;

    return (
        <TodoContext.Provider
            value={{
                allTodos,
                filteredTodos,
                addTodo,
                toggleTodoStatus,
                setSelectedDate,
                getTodosCount,
                createTask, // Provide the createTask function
                deleteTodo, // Provide the deleteTodo function
                editTodo, // Provide the editTodo function
            }}
        >
            {children}
        </TodoContext.Provider>
    );
};

// Custom Hook for Consuming Context
export const useTodos = () => useContext(TodoContext);
