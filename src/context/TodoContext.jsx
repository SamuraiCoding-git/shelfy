import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from "axios";

// Mock API Service
const apiService = {
    getTodos: async () => {
        try {
            const response = await axios.post(
                'https://b4ca-192-36-61-126.ngrok-free.app/api/todos/all',
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
    addTodo: async (userId, todo) => {
        // Simulate API request for adding a todo
        console.log(`Adding todo for user ${userId}:`, todo);
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
                `https://b4ca-192-36-61-126.ngrok-free.app/api/todos/${todoId}/toggle_status`,
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
        const selectedDateString = new Date(date).toDateString();
        const filtered = todos.filter((todo) => new Date(todo.time).toDateString() === selectedDateString);
        setFilteredTodos(filtered);
    };

    // Add a new todo
    const addTodo = (todo) => {
        const newTodo = { ...todo, todo_id: allTodos.length + 1, status: false };
        const updatedTodos = [...allTodos, newTodo];
        setAllTodos(updatedTodos);
        apiService.addTodo(tgService.getUserId(), newTodo);
        updateFilteredTodos(updatedTodos, selectedDate); // Update filtered todos after adding
    };

    // Create a new task with additional details
    const createTask = (title, description, dueDate, reminder, dueTime, reminderTime, tags, repeat) => {
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
            tags: tags, // Tags for the task
        };

        const updatedTodos = [...allTodos, newTask];
        setAllTodos(updatedTodos);
        apiService.addTodo(tgService.getUserId(), newTask);
        updateFilteredTodos(updatedTodos, selectedDate); // Update filtered todos after creating a task
    };

    // Toggle todo status (completed / not completed)
    const toggleTodoStatus = async (todo_id) => {
        console.log("ID: ", todo_id)
        const updatedTodos = allTodos.map((todo) =>
            todo.todo_id === todo_id ? { ...todo, status: !todo.status } : todo
        );
        await apiService.toggleTodoStatus(todo_id)
        setAllTodos(updatedTodos);
        updateFilteredTodos(updatedTodos, selectedDate);// Update filtered todos after status change
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
