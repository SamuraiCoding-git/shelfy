import React, { createContext, useContext, useEffect, useState } from 'react';
import mockData from '../mock-data/exampleTodoList.json';

const todos = mockData.todos;

// Mock API Service
const apiService = {
    getTodos: async (userId) => {
        // Simulate API request
        return todos;
    },
    addTodo: async (userId, todo) => {
        // Simulate API request for adding a todo
        console.log(`Adding todo for user ${userId}`, todo);
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
    const [selectedDate, setSelectedDate] = useState();

    // Load initial todos
    useEffect(() => {
        const loadInitialTodos = async () => {
            const userId = tgService.getUserId();
            try {
                const todos = await apiService.getTodos(userId);
                setAllTodos(todos);
                updateFilteredTodos(todos, selectedDate);
            } catch (error) {
                console.error('Error loading todos:', error);
            }
        };
        loadInitialTodos();
    }, [selectedDate]);

    const updateFilteredTodos = (todos, date) => {
        if (!date) {
            setFilteredTodos(todos);
            return;
        }
        const selectedDateString = new Date(date).toDateString();
        const filtered = todos.filter((todo) => new Date(todo.time).toDateString() === selectedDateString);
        setFilteredTodos(filtered);
    };

    const addTodo = (todo) => {
        const newTodo = { ...todo, id: allTodos.length + 1, status: false };
        const updatedTodos = [...allTodos, newTodo];
        setAllTodos(updatedTodos);
        apiService.addTodo(tgService.getUserId(), newTodo);
        updateFilteredTodos(updatedTodos, selectedDate);
    };

    const toggleTodoStatus = (id) => {
        const updatedTodos = allTodos.map((todo) =>
            todo.id === id ? { ...todo, status: !todo.status } : todo
        );
        setAllTodos(updatedTodos);
        updateFilteredTodos(updatedTodos, selectedDate);
    };

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
            }}
        >
            {children}
        </TodoContext.Provider>
    );
};

// Custom Hook for Consuming Context
export const useTodos = () => useContext(TodoContext);