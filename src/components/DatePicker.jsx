import React, { useState } from 'react';
import clockGrey from "/assets/icons/clock-grey.svg";
import arrowRepeat from "/assets/icons/arrow-repeat.svg";
import chevronUpDown from "/assets/icons/chevron-up-down.svg";
import TimePicker from "./TimePicker.jsx";
import RepeatPicker from "./RepeatPicker.jsx";

export default function DatePicker({ currentDate, onClose, onSave }) {
    const [selectedTime, setSelectedTime] = useState('');
    const [isRepeat, setIsRepeat] = useState(false);
    const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
    const [isRepeatPickerVisible, setIsRepeatPickerVisible] = useState(false);
    const [repeatCount, setRepeatCount] = useState(1);

    // Ensure currentDate is a valid Date object
    const validDate = currentDate instanceof Date && !isNaN(currentDate);

    if (!validDate) {
        return <div>Invalid Date</div>; // Handle invalid date gracefully
    }

    // Format the current month and year as "Mmm YYYY"
    const formatMonthYear = (date) => {
        const options = { year: "numeric", month: "short" };
        return new Intl.DateTimeFormat("en-US", options).format(date); // Example: "Nov 2024"
    };

    // Function to get the days of the month
    const getDaysInMonth = (date) => {
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const firstDay = startOfMonth.getDay();
        const lastDate = endOfMonth.getDate();

        const days = [];
        for (let i = 1; i <= lastDate; i++) {
            days.push(i);
        }

        const emptyDays = Array(firstDay).fill(null);
        return [...emptyDays, ...days];
    };

    const daysInMonth = getDaysInMonth(currentDate);

    // Handle date selection
    const handleSelectDate = (day) => {
        if (day) {
            const selectedDate = new Date(currentDate);
            selectedDate.setDate(day);
            onSave(selectedDate, selectedTime, isRepeat, repeatCount); // Pass updated date
        }
    };

    // Handle changing months
    const handlePrevMonth = () => {
        if (!validDate) return; // Avoid crash if currentDate is invalid
        const prevMonth = new Date(currentDate);
        prevMonth.setMonth(prevMonth.getMonth() - 1);
        onSave(prevMonth); // Pass updated date
    };

    const handleNextMonth = () => {
        if (!validDate) return; // Avoid crash if currentDate is invalid
        const nextMonth = new Date(currentDate);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        onSave(nextMonth); // Pass updated date
    };

    // Time input change handler
    const handleTimeChange = (event) => {
        setSelectedTime(event.target.value);
    };

    // Repeat toggle change handler
    const handleRepeatToggle = () => {
        setIsRepeat(prevState => !prevState);
    };

    // Handle repeat count change
    const handleRepeatCountChange = (count) => {
        setRepeatCount(count);
        setIsRepeatPickerVisible(false); // Close the repeat picker after selecting a value
    };

    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Get today's date
    const today = new Date();
    const isToday = today.getDate() === currentDate.getDate() && today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear();

    return (
        <>
            <div
                className="absolute left-1/2 transform -translate-x-1/2 top-2 w-9 h-1 rounded bg-[#1e1f24] cursor-pointer"
                onClick={() => onClose(true)}
            />
            <div className="relative p-6 mt-2 w-full">
                {isTimePickerVisible && (
                    <div className="absolute bottom-40 right-6 w-1/2 h-1/2 flex justify-center items-center z-10">
                        <TimePicker onTimeSelect={setSelectedTime} onClose={() => setIsTimePickerVisible(false)} />
                    </div>
                )}
                {isRepeatPickerVisible && (
                    <div className="absolute bottom-24 right-16 w-1/2 h-1/2 flex justify-center items-center z-30">
                        <RepeatPicker onTimeSelect={setSelectedTime} onClose={() => setIsRepeatPickerVisible(false)} />
                    </div>
                )}
                <div className="flex items-center justify-between">
                    <button onClick={handlePrevMonth}>
                        <img src="/assets/icons/task/chevron-left.svg" alt="Previous month" className="w-6 h-6"/>
                    </button>

                    <span className="text-white text-xl font-semibold">
                        {formatMonthYear(currentDate)}
                    </span>

                    <button onClick={handleNextMonth}>
                        <img src="/assets/icons/task/chevron-right.svg" alt="Next month" className="w-6 h-6"/>
                    </button>
                </div>

                <div className="mt-8 grid grid-cols-7 gap-4 text-white">
                    {weekdays.map((day, index) => (
                        <div key={index} className="font-bold ml-3 text-[#AEAEB4]">
                            {day}
                        </div>
                    ))}

                    {daysInMonth.map((day, index) => (
                        <div
                            key={index}
                            className={`
                                p-4 cursor-pointer
                                ${day ? 'hover:bg-[#1D77FF]' : 'bg-transparent'} 
                                ${day === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear() ? 'text-[#1D77FF] hover:text-white' : ''} 
                                ${day === currentDate.getDate() ? 'bg-[#1D77FF] text-white' : ''}
                                w-10 h-10 rounded-full 
                                flex items-center justify-center 
                                ${day ? 'border border-transparent hover:ring-2 hover:ring-[#1D77FF]' : ''}
                            `}
                            onClick={() => handleSelectDate(day)}
                        >
                            {day}
                        </div>
                    ))}

                    {/* Empty space to keep the grid balanced */}
                    <div className="w-10 h-10" /> {/* Placeholder cell for alignment */}
                </div>

                <div className="mt-6 bg-[#1E1F24] px-3 rounded-xl py-1">
                    <div className="flex items-center mb-2 py-3">
                        <img
                            src={clockGrey}
                            alt="Time"
                            className="w-5 h-5 mr-2 cursor-pointer"
                            onClick={() => setIsTimePickerVisible(!isTimePickerVisible)}
                        />
                        <label htmlFor="time" className="text-white">Time</label>
                        <div className="ml-auto flex items-center">
                            <span className="text-[#AEAEB4] ml-2 cursor-pointer">
                                None
                            </span>
                            <img
                                src={chevronUpDown}
                                alt="Chevron"
                                className="w-5 h-5 ml-1 cursor-pointer z-20"
                                onClick={() => setIsTimePickerVisible(!isTimePickerVisible)}  // Or another action
                            />
                        </div>
                    </div>

                    <div className="flex items-center mb-4">
                        <img
                            src={arrowRepeat}
                            alt="Repeat"
                            className="w-5 h-5 mr-2 cursor-pointer"
                            onClick={() => setIsRepeatPickerVisible(!isRepeatPickerVisible)}
                        />
                        <label htmlFor="repeat" className="text-white">Add repeats</label>

                        <div className="ml-auto flex items-center">
                            <span className="text-[#AEAEB4] ml-2 cursor-pointer">
                                None
                            </span>
                            <img
                                src={chevronUpDown}
                                alt="Chevron"
                                className="w-5 h-5 ml-1 cursor-pointer z-30"
                                onClick={() => setIsRepeatPickerVisible(!isRepeatPickerVisible)}  // Or another action
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-center mt-8">
                    <button
                        onClick={() => handleSelectDate(currentDate.getDate())}
                        className="px-6 py-2 bg-[#1D77FF] w-full text-white font-bold rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl hover:from-[#8BC34A] hover:to-[#4CAF50] focus:outline-none"
                    >
                        Save
                    </button>
                </div>
            </div>
        </>
    );
}
