import React, { useState } from "react";
import { motion } from "framer-motion";

export default function CreateNewTask({ onClose }) {
    const [isExpanded, setIsExpanded] = useState(false); // Управление состоянием (сжато/расширено)

    const toggleExpanded = () => setIsExpanded((prev) => !prev);

    return (
        <motion.form
            initial={{ y: "100%", opacity: 0, backgroundColor: "rgba(0,0,0,0)" }}
            animate={{ y: 0, opacity: 1, backgroundColor: "#101114" }}
            exit={{ y: "100%", opacity: 0, backgroundColor: "rgba(0,0,0,0)" }}
            transition={{ duration: 0.3 }}
            className={`fixed bottom-0 left-0 w-full z-100 p-6 pb-8 bg-[#101114] rounded-t-3xl flex flex-col transition-transform ${
                isExpanded ? "h-[70%]" : "h-[30%]"
            }`}
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
                    className={`flex items-center ${
                        isExpanded
                            ? "w-full justify-start px-4 py-3"
                            : "justify-center w-12 h-12"
                    } bg-[#1e1f24] rounded-lg`}
                    onClick={() => console.log("Pick a date")}
                >
                    <img src="/assets/icons/task/calendar.svg" alt="calendar" />
                    {isExpanded && (
                        <span className="ml-3 text-[#1D77FF] text-sm font-semibold">
                            Today
                        </span>
                    )}
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
                <button
                    className={`flex items-center ${
                        isExpanded
                            ? "w-full justify-start px-4 py-3"
                            : "justify-center w-12 h-12"
                    } bg-[#1e1f24] rounded-lg`}
                    onClick={toggleExpanded}
                >
                    <img src="/assets/icons/task/more.svg" alt="more" />
                    {isExpanded && (
                        <span className="ml-3 text-white text-sm font-semibold">
                            More Options
                        </span>
                    )}
                </button>
            </div>
        </motion.form>
    );
}
