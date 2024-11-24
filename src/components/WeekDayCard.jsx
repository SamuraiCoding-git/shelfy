import React from 'react';

const WeekDayCard = ({ day, isSelected, onClick }) => {
    const dayOfWeek = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(day);
    const dayOfMonth = new Intl.DateTimeFormat('en-US', { day: '2-digit' }).format(day);

    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-between gap-1 w-16 h-20 p-3 rounded-xl ${
                isSelected ? 'bg-blue-600' : 'bg-gray-900'
            } focus:outline-none`}
        >
            <span className="text-center text-sm font-medium uppercase">{dayOfWeek}</span>
            <img src="/assets/icons/calendar-day_line.svg" alt="calendar icon" />
            <span className="text-center text-lg font-bold">{dayOfMonth}</span>
        </button>
    );
};

export default WeekDayCard;
