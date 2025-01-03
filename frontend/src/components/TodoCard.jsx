import {useUser} from "../context/UserContext.jsx";
import React from "react";

const TodoCard = ({ isCalendarPage, todo, toggleStatus }) => {
    const { addPoints, updateTasksCompleted } = useUser();

    const handleTodoChange = (todo_id, status) => {
        if (!status) {
            toggleStatus(todo_id);
            addPoints(50);
            updateTasksCompleted();
        }
    };

    return (
        <>
            <div
                className={`flex flex-col p-4 gap-2 rounded-3xl ${
                    isCalendarPage ? '' : 'bg-gray-800'
                }`}
            >
                <div className="flex items-center gap-4">
                    {/* Checkbox */}
                    <div className="relative w-6 h-6">
                        <input
                            type="checkbox"
                            id={`todo-${todo.todo_id}`}  // Use `todo.todo_id` here
                            checked={todo.status}  // Bind the checkbox to `todo.status`
                            onChange={() => handleTodoChange(todo.todo_id, todo.status)}  // Call `toggleStatus` when clicked
                            className="appearance-none w-full h-full rounded-full bg-gray-700 border-2 border-gray-600 checked:bg-blue-500 transition-all duration-200 focus:outline-dotted focus:outline-2 focus:outline-black"
                        />
                        <span
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-0.5 bg-white rotate-45 origin-left scale-x-0 transition-all duration-200 checked:scale-x-100"></span>
                        <span
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-0.5 bg-white -rotate-45 origin-left scale-x-0 transition-all duration-200 checked:scale-x-100"></span>
                    </div>

                    {/* Title */}
                    <label
                        htmlFor={`todo-${todo.todo_id}`}
                        className={`text-lg font-semibold leading-6 transition-all duration-500 ${
                            todo.status ? 'line-through text-blue-500' : 'text-white'
                        }`}
                    >
                        {todo.title}
                    </label>
                </div>

                {/* Description */}
                <div className="text-sm font-medium leading-6 text-white">
                    {todo.description}
                </div>

                {/* Additional Info */}
                <div className="flex items-center gap-2">
                    {/* Tags */}
                    {todo.tags && (
                        <div className="flex gap-2">
                            {/* Ensure todo.tags is an array before calling .map() */}
                            {Array.isArray(todo.tags) && todo.tags.map((badge, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-center px-2 py-1 text-xs font-semibold text-white rounded-full"
                                    style={{backgroundColor: badge.color}}
                                >
                                    {badge.name}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Duration */}
                    {todo.time && (
                        <div className="flex items-center gap-1">
                            <img src="/assets/icons/clock.svg" alt="clock" className="w-4 h-4"/>
                            <p className="text-xs font-semibold text-gray-400">
                                {todo.time}
                            </p>
                        </div>
                    )}

                    {/* Diamond container moved to the right */}
                    <div className="flex items-center gap-1 ml-auto">
                        <p className={`text-sm ${todo.status ? "text-[#1D77FF]" : "text-white"} font-semibold`}>
                            +50
                        </p>
                        <img
                            src="/assets/icons/diamond_header.svg"
                            alt="token balance icon"
                            className="h-4 w-4"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default TodoCard;
