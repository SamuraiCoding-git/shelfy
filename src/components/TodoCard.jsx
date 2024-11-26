import React from 'react';

const TodoCard = ({ isCalendarPage, todo, toggleStatus }) => {
    return (
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
                        id={`todo-${todo.id}`}
                        checked={todo.status}
                        onChange={toggleStatus}
                        className="appearance-none w-full h-full rounded-full bg-gray-700 border-2 border-gray-600 checked:bg-blue-500 transition-all duration-200 focus:outline-dotted focus:outline-2 focus:outline-black"
                    />
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-0.5 bg-white rotate-45 origin-left scale-x-0 transition-all duration-200 checked:scale-x-100"></span>
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-0.5 bg-white -rotate-45 origin-left scale-x-0 transition-all duration-200 checked:scale-x-100"></span>
                </div>

                {/* Title */}
                <label
                    htmlFor={`todo-${todo.id}`}
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
                <div className="flex gap-2">
                    {todo.tags.map((badge, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-center px-2 py-1 text-xs font-semibold text-white rounded-full"
                            style={{ backgroundColor: badge.color }}
                        >
                            {badge.name}
                        </div>
                    ))}
                </div>

                {/* Duration */}
                {todo.duration && (
                    <div className="flex items-center gap-1">
                        <img src="/assets/icons/clock.svg" alt="clock" className="w-4 h-4" />
                        <p className="text-xs font-semibold text-gray-400">
                            {`${new Date(todo.duration[0]).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                            })} - ${new Date(todo.duration[1]).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}`}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TodoCard;