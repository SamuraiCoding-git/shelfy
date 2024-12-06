import React from 'react';
import TodoCard from './TodoCard';
import { useTodos } from '../context/TodoContext'; // Import the context hook

const TodoList = ({ isCalendarPage }) => {
    const { filteredTodos, toggleTodoStatus, selectedDate } = useTodos(); // Добавлено selectedDate

    return (
        <div
            className={`flex flex-col gap-4 ${
                isCalendarPage ? 'bg-none py-6 pt-6 pb-[74px]' : 'p-6 bg-gray-900 rounded-3xl'
            }`}
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
                <div
                    className="flex flex-col gap-4 overflow-y-auto min-h-[200px] max-h-[500px] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900"
                >
                    {filteredTodos.map((todo) => (
                        <TodoCard
                            key={todo.id}
                            isCalendarPage={isCalendarPage}
                            todo={todo}
                            toggleStatus={() => toggleTodoStatus(todo.id)}
                        />
                    ))}
                </div>
            ) : (
                <div
                    className={`flex flex-col items-center justify-center text-white ${
                        filteredTodos.length < 1 ? 'min-h-[30vh]' : ''
                    }`}
                >
                    <img className="text-lg font-medium" src="/assets/icons/validation.svg"/>
                </div>
            )}
        </div>
    );
};

export default TodoList;
