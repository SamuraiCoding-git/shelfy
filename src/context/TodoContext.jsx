import React, { createContext, useContext, useEffect, useState } from 'react';
import mockData from '../mock-data/exampleTodoList.json';

// Mock data and services
const todos = mockData.todos;

// Mock API Service
const apiService = {
    getTodos: async (userId) => {
        // Simulate an API request and return the todos
        return todos;
    },
    addTodo: async (userId, todo) => {
        // Simulate API request for adding a todo
        console.log(`Adding todo for user ${userId}:`, todo);
    },
};

// Mock Telegram Service
const tgService = {
    getUserId: () => '422999166', // Simulate getting user ID
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
            const userId = tgService.getUserId();
            try {
                const todos = await apiService.getTodos(userId);
                setAllTodos(todos);
                updateFilteredTodos(todos, selectedDate); // Apply initial filtering
            } catch (error) {
                console.error('Error loading todos:', error);
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
        const newTodo = { ...todo, id: allTodos.length + 1, status: false };
        const updatedTodos = [...allTodos, newTodo];
        setAllTodos(updatedTodos);
        apiService.addTodo(tgService.getUserId(), newTodo);
        updateFilteredTodos(updatedTodos, selectedDate); // Update filtered todos after adding
    };

    // Create a new task with additional details
    const createTask = (title, description, dueDate, dueTime, tags, repeat) => {
        const newTask = {
            id: allTodos.length + 1, // Generate a new ID
            title,
            description,
            time: new Date(dueDate).toISOString(), // Convert dueDate to ISO string for 'time'
            duration: new Date(dueDate).toISOString(), // Set duration (can be updated later)
            status: false, // Task is initially not completed
            repeat, // Repeat value for the task
            tags, // Tags for the task
        };

        const updatedTodos = [...allTodos, newTask];
        setAllTodos(updatedTodos);
        apiService.addTodo(tgService.getUserId(), newTask);
        updateFilteredTodos(updatedTodos, selectedDate); // Update filtered todos after creating a task
    };

    // Toggle todo status (completed / not completed)
    const toggleTodoStatus = (id) => {
        const updatedTodos = allTodos.map((todo) =>
            todo.id === id ? { ...todo, status: !todo.status } : todo
        );
        setAllTodos(updatedTodos);
        updateFilteredTodos(updatedTodos, selectedDate); // Update filtered todos after status change
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
            }}
        >
            {children}
        </TodoContext.Provider>
    );
};

// Custom Hook for Consuming Context
export const useTodos = () => useContext(TodoContext);
