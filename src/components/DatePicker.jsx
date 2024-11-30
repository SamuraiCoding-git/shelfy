import React from 'react';

export default function DatePicker({ currentDate, onClose, onSave }) {
    // Format the current month and year as "Mmm YYYY"
    const formatMonthYear = (date) => {
        const options = { year: "numeric", month: "short" };
        return new Intl.DateTimeFormat("en-US", options).format(date); // Example: "Nov 2024"
    };

    // Function to get the days of the month
    const getDaysInMonth = (date) => {
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        // Get the first day of the month
        const firstDay = startOfMonth.getDay(); // Day of the week (0 = Sunday, 1 = Monday, etc.)
        const lastDate = endOfMonth.getDate();

        // Create an array with all the days in the month
        const days = [];
        for (let i = 1; i <= lastDate; i++) {
            days.push(i);
        }

        // Add empty spaces before the first day to align correctly with the week
        const emptyDays = Array(firstDay).fill(null);
        return [...emptyDays, ...days];
    };

    // Get the days for the current month
    const daysInMonth = getDaysInMonth(currentDate);

    // Handle date selection
    const handleSelectDate = (day) => {
        if (day) {
            const selectedDate = new Date(currentDate);
            selectedDate.setDate(day);
            onSave(selectedDate);
        }
    };

    // Handle changing months
    const handlePrevMonth = () => {
        const prevMonth = new Date(currentDate);
        prevMonth.setMonth(prevMonth.getMonth() - 1);
        onSave(prevMonth);
    };

    const handleNextMonth = () => {
        const nextMonth = new Date(currentDate);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        onSave(nextMonth);
    };

    return (
        <>
            <div
                className="absolute left-1/2 transform -translate-x-1/2 top-2 w-9 h-1 cursor-pointer z-10"
                onClick={onClose}
            />
            <div className="relative p-6 rounded-lg shadow-lg -mt-6">
                {/* Header with chevrons and month/year text */}
                <div className="flex items-center justify-between">
                    {/* Chevron Left */}
                    <button onClick={handlePrevMonth}>
                        <img src="/assets/icons/task/chevron-left.svg" alt="Previous month" className="w-6 h-6" />
                    </button>

                    {/* Month and Year */}
                    <span className="text-white text-xl font-semibold">
                        {formatMonthYear(currentDate)}
                    </span>

                    {/* Chevron Right */}
                    <button onClick={handleNextMonth}>
                        <img src="/assets/icons/task/chevron-right.svg" alt="Next month" className="w-6 h-6" />
                    </button>
                </div>

                {/* Calendar grid */}
                <div className="mt-12 grid grid-cols-7 gap-2 text-center text-[#AEAEB4]">
                    {/* Weekday headers */}
                    <div className="font-bold">Sun</div>
                    <div className="font-bold">Mon</div>
                    <div className="font-bold">Tue</div>
                    <div className="font-bold">Wed</div>
                    <div className="font-bold">Thu</div>
                    <div className="font-bold">Fri</div>
                    <div className="font-bold">Sat</div>

                    {/* Render days of the month */}
                    {daysInMonth.map((day, index) => (
                        <div
                            key={index}
                            className={`p-4 cursor-pointer 
                            ${day ? 'hover:bg-[#3A92FF]' : 'bg-transparent'} 
                            ${day === currentDate.getDate() ? 'bg-[#1D77FF] text-white' : ''} 
                            w-12 h-12 rounded-full 
                            flex items-center justify-center 
                            ${day ? 'border border-transparent hover:ring-2 hover:ring-[#3A92FF]' : ''}`}
                            onClick={() => handleSelectDate(day)}
                        >
                            {day}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};
