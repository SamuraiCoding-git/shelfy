import React, { useState, useEffect } from 'react';
import clockGrey from "/assets/icons/clock-grey.svg";
import arrowRepeat from "/assets/icons/arrow-repeat.svg";
import chevronUpDown from "/assets/icons/chevron-up-down.svg";
import TimePicker from "./TimePicker.jsx";
import RepeatPicker from "./RepeatPicker.jsx";
import Dismiss from "/assets/icons/dismiss-blue.svg";

export default function DatePicker({ currentDate, onClose, onChange, onSave }) {
    const [selectedTime, setSelectedTime] = useState();
    const [isRepeat, setIsRepeat] = useState(false);
    const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
    const [isRepeatPickerVisible, setIsRepeatPickerVisible] = useState(false);
    const [selectedRepeat, setSelectedRepeat] = useState('None');
    const [repeatDates, setRepeatDates] = useState([]); // To store the repeat dates
    const [selectedDay, setSelectedDay] = useState(); // Store the selected date

    // Validate and ensure currentDate is a valid Date object
    const validDate = currentDate instanceof Date && !isNaN(currentDate);
    if (!validDate) {
        console.error("Invalid currentDate provided to DatePicker");
        return <div>Invalid Date</div>;
    }

    // Handler for selecting an item
    const handleSelectRepeat = (value) => {
        setSelectedRepeat(value);
        setIsRepeatPickerVisible(!isRepeatPickerVisible);

        // Calculate repeat dates based on the selected repeat option
        const dates = calculateRepeatDates(value);
        setRepeatDates(dates);
    };

    const calculateRepeatDates = (repeatType) => {
        const dates = [];
        const startDate = new Date(currentDate);
        const currentDay = startDate.getDate();
        const currentMonth = startDate.getMonth();
        const currentYear = startDate.getFullYear();

        // Determine the repeat interval based on the selected option
        if (repeatType === 'Daily') {
            // For daily, highlight every day from the selected date onwards
            for (let i = currentDay + 1; i <= 31; i++) {
                const repeatDate = new Date(currentYear, currentMonth, i);
                if (repeatDate > startDate) {
                    dates.push(repeatDate);
                }
            }
        } else if (repeatType === 'Weekly') {
            // For weekly, highlight the same weekday every week starting from the selected date
            const currentDayOfWeek = startDate.getDay();
            const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

            for (let i = 1; i <= 4; i++) {
                const daysToAdd = (7 - (currentDayOfWeek - startDate.getDay()) + 7) % 7 + i * 7;
                const repeatDate = new Date(currentYear, currentMonth, currentDay + daysToAdd);

                if (repeatDate > startDate && repeatDate.getDate() <= daysInCurrentMonth) {
                    dates.push(repeatDate);
                }
            }
        } else if (repeatType === 'Monthly') {
            // For monthly, highlight the same day in future months starting from the current month
            for (let i = 1; i <= 12; i++) { // For the next 12 months
                const repeatDate = new Date(currentYear, currentMonth + i, currentDay);
                if (repeatDate > startDate) {
                    dates.push(repeatDate);
                }
            }
        }
        return dates;
    };


    const formatMonthYear = (date) => {
        const options = { year: "numeric", month: "short" };
        return new Intl.DateTimeFormat("en-US", options).format(date);
    };

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

    const handleSelectDate = (day) => {
        console.log(daysInMonth)
        if (day) {
            const selectedDate = new Date(currentDate);
            selectedDate.setDate(day);
            setSelectedDay(selectedDate); // Update selected day as Date object
            onChange(selectedDate); // Pass the full Date object to onChange
        }
    };

    const handlePrevMonth = () => {
        if (!validDate) return;

        const prevMonth = new Date(currentDate);
        prevMonth.setMonth(prevMonth.getMonth() - 1);

        // Prevent moving to past months
        const today = new Date();
        if (prevMonth.getFullYear() < today.getFullYear() ||
            (prevMonth.getFullYear() === today.getFullYear() && prevMonth.getMonth() < today.getMonth())) {
            return; // Cannot go to past months
        }

        onChange(prevMonth);
    };

    const handleNextMonth = () => {
        if (!validDate) return;
        const nextMonth = new Date(currentDate);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        onChange(nextMonth);
    };

    const handleResetSelectedTime = () => {
        setSelectedTime();
    };

    const handleResetRepeat = () => {
        setSelectedRepeat('None');
        setRepeatDates([]); // Clear repeat dates
    };

    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();

    // Update the repeatDates whenever selectedRepeat or selectedDay changes
    useEffect(() => {
        if (selectedRepeat !== 'None') {
            const dates = calculateRepeatDates(selectedRepeat);
            setRepeatDates(dates);
        }
    }, [selectedRepeat, selectedDay]);

    return (
        <>
            <div
                className="absolute left-1/2 transform -translate-x-1/2 top-2 w-9 h-1 rounded bg-[#1e1f24] cursor-pointer"
                onClick={() => onClose(true)}
            />
            <div className="relative p-6 mt-2 w-full">
                {isTimePickerVisible && (
                    <div className="absolute bottom-40 right-6 w-1/2 h-1/2 flex justify-center items-center z-10">
                        <TimePicker onTimeSelect={setSelectedTime} onClose={() => setIsTimePickerVisible(false)}/>
                    </div>
                )}
                {isRepeatPickerVisible && (
                    <div className="absolute bottom-24 right-16 w-1/2 h-1/2 flex justify-center items-center z-30">
                        <RepeatPicker handleSelectRepeat={handleSelectRepeat} selectedRepeat={selectedRepeat}/>
                    </div>
                )}
                <div className="flex items-center justify-between w-full">
                    <span className="text-white text-xl font-semibold">
                        {formatMonthYear(currentDate)}
                    </span>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handlePrevMonth}
                            disabled={currentDate.getFullYear() === today.getFullYear() && currentDate.getMonth() === today.getMonth()}
                        >
                            <img src="/assets/icons/task/chevron-left.svg" alt="Previous month" className="w-6 h-6"/>
                        </button>
                        <button onClick={handleNextMonth}>
                            <img src="/assets/icons/task/chevron-right.svg" alt="Next month" className="w-6 h-6"/>
                        </button>
                    </div>
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
                            ${day ? 'hover:bg-[#1E1F24]' : 'bg-transparent'}
                            ${day === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear() ? 'text-[#1D77FF] hover:text-white' : ''}
                            ${day === currentDate.getDate() ? 'bg-[#1D77FF] text-white' : ''}
                            ${repeatDates.some(repeatDate => repeatDate.getDate() === day && repeatDate.getMonth() === currentDate.getMonth() && repeatDate.getFullYear() === currentDate.getFullYear()) ? 'bg-[#1E1F24] text-white' : ''}
                            ${day && (new Date(currentDate.getFullYear(), currentDate.getMonth(), day).setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0)) ? 'bg-transparent cursor-not-allowed' : ''}
                            w-10 h-10 rounded-full
                            flex items-center justify-center
                            ${day ? 'border border-transparent hover:ring-2 hover:ring-[#1D77FF]' : ''}
                            `}
                            onClick={() => day && new Date(currentDate.getFullYear(), currentDate.getMonth(), day) >= today && handleSelectDate(day)}
                        >
                            {day}
                        </div>
                    ))}

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
                            <span
                                className={`${selectedTime ? "text-[#1D77FF]" : "text-[#AEAEB4]"} ml-2 cursor-pointer`}>
                                {selectedTime || 'None'}
                            </span>
                            {selectedTime ?
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

                    <div className="flex items-center mb-4">
                        <img
                            src={arrowRepeat}
                            alt="Repeat"
                            className="w-5 h-5 mr-2 cursor-pointer"
                            onClick={() => setIsRepeatPickerVisible(!isRepeatPickerVisible)}
                        />
                        <label htmlFor="repeat" className="text-white">Add repeats</label>

                        <div className="ml-auto flex items-center">
                            <span
                                className={`${selectedRepeat && selectedRepeat !== 'None' ? "text-[#1D77FF]" : "text-[#AEAEB4]"} ml-2 cursor-pointer`}>
                                {selectedRepeat && selectedRepeat !== 'None' ? selectedRepeat : 'None'}
                            </span>
                            {selectedRepeat && selectedRepeat !== 'None' ? (
                                <img
                                    src={Dismiss}
                                    alt="Dismiss"
                                    className="w-5 h-5 ml-1 cursor-pointer z-20"
                                    onClick={handleResetRepeat}
                                />
                            ) : (
                                <img
                                    src={chevronUpDown}
                                    alt="Chevron"
                                    className="w-5 h-5 ml-1 cursor-pointer z-20"
                                    onClick={() => setIsRepeatPickerVisible(!isRepeatPickerVisible)}
                                />
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-center mt-8">
                    <button
                        onClick={() => onSave(selectedDay, selectedTime, selectedRepeat)}
                        className="px-6 py-2 bg-[#1D77FF] w-full text-white font-bold rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl hover:from-[#8BC34A] hover:to-[#4CAF50] focus:outline-none"
                    >
                        Save
                    </button>
                </div>
            </div>
        </>
    );
}
