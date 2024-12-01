import React, { useState } from "react";
import { motion } from "framer-motion";
import DatePicker from "./DatePicker"; // Import the DatePicker component

export default function CreateNewTask({ onClose }) {
    const [isExpanded, setIsExpanded] = useState(false); // Tracks the expanded state
    const [showDatePicker, setShowDatePicker] = useState(false); // Controls visibility of DatePicker
    const [currentDate, setCurrentDate] = useState(new Date()); // Stores the current date
    const [currentHeight, setCurrentHeight] = useState(30); // Controls the height of the form

    // Toggle the expansion state and adjust height accordingly
    const toggleExpanded = (flag = false) => {
        const newHeight = isExpanded ? 30 : 55; // Toggle height between 30 and 55
        setCurrentHeight(newHeight);
        setIsExpanded(prevState => !prevState); // Toggle expansion state using functional update
        if (flag) {
            setShowDatePicker(false);
        }
    };

    // Toggle the DatePicker visibility and adjust height accordingly
    const toggleDatePicker = () => {
        const newShowDatePicker = !showDatePicker;
        setShowDatePicker(newShowDatePicker);

        // If DatePicker is being shown, set height to 95
        if (newShowDatePicker) {
            setCurrentHeight(95);
        } else {
            // If DatePicker is hidden, revert height to the state based on expansion
            setCurrentHeight(isExpanded ? 55 : 30);
        }
    };

    return (
        <>
            <motion.form
                initial={{ y: "100%", opacity: 0 }}
                animate={{
                    y: 0,
                    opacity: 1,
                    backgroundColor: "#101114",
                    height: `${currentHeight}%` // Dynamically adjust the height based on state
                }}
                exit={{
                    y: "100%",
                    opacity: 0,
                }}
                transition={{
                    duration: 0.4, // Shorter duration for quicker response
                    ease: [0.4, 0.0, 0.2, 1], // Smooth ease-out curve
                }}
                style={{
                    willChange: "transform, opacity", // Optimization
                }}
                className="fixed bottom-0 left-0 w-full z-50 p-6 pb-8 bg-[#101114] rounded-t-3xl flex flex-col"
            >
                {/* Top panel */}
                <div
                    className="absolute left-1/2 transform -translate-x-1/2 top-2 w-9 h-1 rounded bg-[#1e1f24] cursor-pointer"
                    onClick={toggleExpanded} // Toggle expand/collapse
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

                {/* Input fields */}
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

                {/* Buttons */}
                <div className={`${isExpanded ? "flex flex-col gap-4 mt-4" : "flex flex-row gap-2 mt-6"}`}>
                    <button
                        type="button"
                        className={`flex items-center gap-3 ${
                            isExpanded ? "w-full justify-start px-4 py-3" : "justify-center px-3 py-3"
                        } bg-[#1e1f24] rounded-lg`}
                        onClick={toggleDatePicker} // Toggle DatePicker visibility
                    >
                        <img
                            src={`${
                                isExpanded
                                    ? "/assets/icons/calendar.svg"
                                    : "/assets/icons/task/calendar.svg"
                            }`}
                            alt="calendar"
                            className={`${isExpanded ? "w-5 h-5" : "w-6 h-6"}`}
                        />
                        <span className="text-sm font-semibold text-[#1D77FF]">
                            Today
                        </span>
                    </button>

                    <button
                        className={`flex items-center ${
                            isExpanded ? "w-full justify-start px-4 py-3" : "justify-center w-12 h-12"
                        } bg-[#1e1f24] rounded-lg`}
                        onClick={() => console.log("Add Reminder")}
                    >
                        <img src="/assets/icons/task/notification.svg" alt="notification"/>
                        {isExpanded && (
                            <span className="ml-3 text-white text-sm font-semibold">
                                Add Reminder
                            </span>
                        )}
                    </button>
                    <button
                        className={`flex items-center ${
                            isExpanded ? "w-full justify-start px-4 py-3" : "justify-center w-12 h-12"
                        } bg-[#1e1f24] rounded-lg`}
                        onClick={() => console.log("Assign Tags")}
                    >
                        <img src="/assets/icons/task/tag.svg" alt="tags"/>
                        {isExpanded && (
                            <span className="ml-3 text-white text-sm font-semibold">
                                Assign Tags
                            </span>
                        )}
                    </button>
                    {!isExpanded && (
                        <button
                            className="flex items-center justify-center w-12 h-12 bg-[#1e1f24] rounded-lg"
                            onClick={toggleExpanded} // Toggle the expand/collapse button
                        >
                            <img src="/assets/icons/task/more.svg" alt="more"/>
                        </button>
                    )}
                    {isExpanded && (
                        <button
                            className="flex items-center w-full justify-start px-4 py-3 bg-[#1e1f24] rounded-lg"
                            onClick={() => console.log("Make it a habit")}
                        >
                            <img src="/assets/icons/habit.svg" alt="habit"/>
                            <span className="ml-3 text-white text-sm font-semibold">
                                Make it a habit
                            </span>
                        </button>
                    )}
                </div>

                {/* DatePicker Transition */}
                {showDatePicker && (
                    <div
                        className="fixed top-0 left-0 w-full h-full bg-[#101114] p-6 rounded-t-3xl flex flex-col items-start justify-start z-60"
                    >
                        <DatePicker
                            currentDate={currentDate}   // Pass the current date to DatePicker
                            onClose={toggleExpanded}
                            onSave={(selectedDate) => {
                                console.log("Selected date:", selectedDate);
                                setCurrentDate(selectedDate); // Update the current date on save
                            }}
                        />
                    </div>
                )}
            </motion.form>
        </>
    );
};
