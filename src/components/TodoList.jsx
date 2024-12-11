import React from 'react';
import TodoCard from './TodoCard';
import { useTodos } from '../context/TodoContext'; // Assuming you're using a context hook

const TodoList = ({ isCalendarPage }) => {
    const { filteredTodos, toggleTodoStatus, selectedDate } = useTodos(); // Get todos, toggle function, and selected date

    return (
        <div
            className={`flex flex-col gap-4 ${
                isCalendarPage ? 'bg-none py-6 pt-6 pb-[74px]' : 'p-6 bg-gray-900 rounded-3xl'
            } overflow-y-auto`} // Add scrolling
            style={{ maxHeight: 'calc(100vh - 74px)' }} // Set max height
        >
            {/* Title */}
            {!isCalendarPage && (
                <div className="flex items-center gap-2 text-white mb-4">
                    <img src="/assets/icons/task_square.svg" alt="task square" />
                    <h1 className="text-xl font-semibold">Today&#39;s To-Do List</h1>
                </div>
            )}

            {/* Selected Date Display */}
            {selectedDate && (
                <div className="text-gray-400 mb-2 text-sm">
                    Selected Date: {new Date(selectedDate).toDateString()}
                </div>
            )}

            {/* Todos */}
            {filteredTodos.length > 0 ? (
                <div className="flex flex-col gap-4 overflow-y-auto">
                    {filteredTodos.map((todo) => (
                        <TodoCard
                            key={todo.todo_id}
                            isCalendarPage={isCalendarPage}
                            todo={todo}
                            toggleStatus={toggleTodoStatus}  // Pass toggle function
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-white min-h-[30vh]">
                    <img className="text-lg font-medium" src="/assets/icons/validation.svg" />
                </div>
            )}
        </div>
    );
};

export default TodoList;
