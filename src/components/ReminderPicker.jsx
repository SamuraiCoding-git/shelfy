import React, { useState, useEffect } from 'react';
import clockGrey from "/assets/icons/clock-grey.svg";
import Dismiss from "/assets/icons/dismiss-blue.svg";
import chevronUpDown from "/assets/icons/chevron-up-down.svg";
import TimePicker from "./TimePicker.jsx";

export default function ReminderPicker({
                                           onSave,
                                           onClose
                                       }) {
    const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
    const [selectedReminderTime, setSelectedReminderTime] = useState();
    const [selectedReminder, setSelectedReminder] = useState();

    const handleResetSelectedTime = () => {
        setSelectedReminderTime(); // Reset the time
    };

    // Instead of calling toggleReminder directly in render, use an effect or callback
    const handleToggleReminder = () => {
        onSave(selectedReminderTime, selectedReminder);
    }

    const handleSelectReminder = (value) => {
        setSelectedReminder(value);
    };

    return (
        <>
            <div
                className="absolute left-1/2 transform -translate-x-1/2 top-4 w-9 h-1 rounded bg-[#1e1f24] cursor-pointer"
                onClick={onClose} // Use the callback here
            />
            <div className="relative p-6 mt-2 w-full">
                {isTimePickerVisible && (
                    <div className="absolute bottom-40 right-6 w-1/2 h-1/2 flex justify-center items-center z-10">
                        <TimePicker onTimeSelect={setSelectedReminderTime}
                                    onClose={() => setIsTimePickerVisible(false)}/>
                    </div>
                )}
                <div className="flex items-center -ml-1 -space-x-3 -mt-6 mb-4">
                    <button onClick={() => onClose(true)} className="flex-shrink-0">
                        <img src="/assets/icons/task/chevron-left.svg" alt="back"/>
                    </button>
                    <h1 className="text-lg font-semibold text-center flex-grow">Reminder</h1>
                </div>
                <ul className="text-white space-y-1 whitespace-nowrap">
                    {/* Example list items */}
                    {['None', 'On the day', '1 day early', '2 days early', '3 days early', '1 week early'].map((value) => (
                        <li
                            key={value}
                            className={`flex items-center justify-between cursor-pointer rounded-lg gap-48 py-2 font-medium text-white transition-all`}
                            onClick={() => handleSelectReminder(value)}
                        >
                            <span className="-mr-4">{value}</span>
                            {selectedReminder === value && (
                                <img
                                    src="/assets/icons/tick.svg" // Replace with the correct path
                                    alt="Selected"
                                    className="w-6 h-6 mr-4"
                                />
                            )}
                        </li>
                    ))}
                </ul>
                <div className="mt-6 bg-[#1E1F24] px-3 rounded-xl">
                    <div className="flex items-center mb-2 py-3">
                        <img
                            src={clockGrey}
                            alt="Time"
                            className="w-5 h-5 mr-2 cursor-pointer"
                            onClick={() => setIsTimePickerVisible(!isTimePickerVisible)}
                        />
                        <label htmlFor="time" className="text-white">Time</label>
                        <div className="ml-auto flex items-center">
                            <span
                                className={`${selectedReminderTime ? "text-[#1D77FF]" : "text-[#AEAEB4]"} ml-2 cursor-pointer`}
                            >
                                {selectedReminderTime || 'None'}
                            </span>
                            {selectedReminderTime ?
                                <img
                                    src={Dismiss}
                                    alt="Dismiss"
                                    className="w-5 h-5 ml-1 cursor-pointer z-20"
                                    onClick={handleResetSelectedTime}
                                /> :
                                <img
                                    src={chevronUpDown}
                                    alt="Chevron"
                                    className="w-5 h-5 ml-1 cursor-pointer z-20"
                                    onClick={() => setIsTimePickerVisible(!isTimePickerVisible)}
                                />}
                        </div>
                    </div>
                </div>
                <div className="flex justify-center mt-8">
                    <button
                        className="px-6 py-2 bg-[#1D77FF] w-full text-white font-bold rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl hover:from-[#8BC34A] hover:to-[#4CAF50] focus:outline-none"
                        onClick={handleToggleReminder} // Trigger the callback here too
                    >
                        Save
                    </button>
                </div>
            </div>
        </>
    );
}
