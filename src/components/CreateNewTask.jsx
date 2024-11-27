import React, { useState } from "react";
import { motion } from "framer-motion";
import DatePicker from "./DatePicker"; // Import the DatePicker component

export default function CreateNewTask({ onClose }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const toggleExpanded = () => setIsExpanded((prev) => !prev);
    const toggleDatePicker = () => setShowDatePicker((prev) => !prev);

    return (
        <>
            <motion.form
                initial={{ y: "100%", opacity: 0 }}
                animate={{
                    y: 0,
                    opacity: 1,
                    backgroundColor: "#101114",
                    height: isExpanded ? "70%" : "30%",
                }}
                exit={{
                    y: "100%",
                    opacity: 0,
                }}
                transition={{
                    duration: 0.4, // Укороченная длительность для быстрого отклика
                    ease: [0.4, 0.0, 0.2, 1], // Плавная ease-out кривая
                }}
                style={{
                    willChange: "transform, opacity", // Оптимизация
                }}
                className="fixed bottom-0 left-0 w-full z-100 p-6 pb-8 bg-[#101114] rounded-t-3xl flex flex-col"
            >
                {/* Верхняя панель */}
                <div
                    className="absolute left-1/2 transform -translate-x-1/2 top-2 w-9 h-1 rounded bg-[#1e1f24] cursor-pointer"
                    onClick={toggleExpanded}
                />
                <div className="flex justify-between items-center">
                    <button onClick={onClose}>
                        <img src="/assets/icons/task/chevron-left.svg" alt="back" />
                    </button>
                    <p className="text-white text-lg font-semibold leading-6">
                        Create new task
                    </p>
                    <button className="text-primary text-[#1D77FF] text-base font-semibold leading-5">
                        Save
                    </button>
                </div>

                {/* Основные поля ввода */}
                <div className="flex flex-col gap-3 mt-6">
                    <input
                        type="text"
                        placeholder="Task Title"
                        className="outline-none caret-primary bg-transparent text-white text-lg font-semibold leading-6"
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        className="outline-none caret-primary bg-transparent text-gray-400 text-sm font-medium leading-4"
                    />
                </div>

                {/* Кнопки */}
                <div className={`mt-6 ${isExpanded ? "flex flex-col gap-4" : "flex flex-row gap-2"}`}>
                    <button
                        className={`flex items-center gap-3 ${
                            isExpanded
                                ? "w-full justify-start px-4 py-3"
                                : "justify-center px-3 py-3"
                        } bg-[#1e1f24] rounded-lg`}
                        onClick={toggleDatePicker}
                    >
                        <img
                            src={`${
                                isExpanded
                                    ? "/assets/icons/calendar.svg"
                                    : "/assets/icons/task/calendar.svg"
                            }`}
                            alt="calendar"
                            className={`${
                                isExpanded ? "w-5 h-5" : "w-6 h-6"
                            }`}
                        />
                        <span
                            className={`text-sm font-semibold ${
                                isExpanded ? "text-[#1D77FF]" : "text-[#1D77FF]"
                            }`}
                        >
                            Today
                        </span>
                    </button>

                    <button
                        className={`flex items-center ${
                            isExpanded
                                ? "w-full justify-start px-4 py-3"
                                : "justify-center w-12 h-12"
                        } bg-[#1e1f24] rounded-lg`}
                        onClick={() => console.log("Add Reminder")}
                    >
                        <img src="/assets/icons/task/notification.svg" alt="notification" />
                        {isExpanded && (
                            <span className="ml-3 text-white text-sm font-semibold">
                                Add Reminder
                            </span>
                        )}
                    </button>
                    <button
                        className={`flex items-center ${
                            isExpanded
                                ? "w-full justify-start px-4 py-3"
                                : "justify-center w-12 h-12"
                        } bg-[#1e1f24] rounded-lg`}
                        onClick={() => console.log("Assign Tags")}
                    >
                        <img src="/assets/icons/task/tag.svg" alt="tags" />
                        {isExpanded && (
                            <span className="ml-3 text-white text-sm font-semibold">
                                Assign Tags
                            </span>
                        )}
                    </button>
                    {!isExpanded && (
                        <button
                            className="flex items-center justify-center w-12 h-12 bg-[#1e1f24] rounded-lg"
                            onClick={toggleExpanded}
                        >
                            <img src="/assets/icons/task/more.svg" alt="more" />
                        </button>
                    )}
                    {isExpanded && (
                        <button
                            className={`flex items-center w-full justify-start px-4 py-3 bg-[#1e1f24] rounded-lg`}
                            onClick={() => console.log("Assign Tags")}
                        >
                            <img src="/assets/icons/habit.svg" alt="tags" />
                            <span className="ml-3 text-white text-sm font-semibold">
                                Make it a habit
                            </span>
                        </button>
                    )}
                </div>
            </motion.form>

            {/* DatePicker */}
            {showDatePicker && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg">
                        <DatePicker />
                        <button
                            className="mt-4 w-full bg-blue-500 text-white py-2 rounded"
                            onClick={toggleDatePicker}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
