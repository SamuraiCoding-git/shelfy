import React from 'react';

const WeekDayCard = ({ day, isSelected, onClick, taskCount }) => {
    const dayOfWeek = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(day);
    const dayOfMonth = new Intl.DateTimeFormat('en-US', { day: '2-digit' }).format(day);

    return (
        <button
            onClick={onClick}
            className={`flex-none flex flex-col items-center justify-between gap-2 w-16 h-20 p-3 rounded-3xl ${
                isSelected ? 'bg-[#1D77FF] text-white' : 'bg-[#1E1F24] text-[#AEAEB4]'
            } focus:outline-none`}
        >
            <span className={`text-center ${isSelected ? 'text-white' : 'text-gray-500'} mt-[-4px] text-[16px] font-medium uppercase`}>{dayOfWeek}</span>
            <span className="text-center text-lg font-bold mt-[-10px]">{dayOfMonth}</span>
            <span className="text-center text-2xl font-medium mt-[-16px]">{'•'.repeat(Math.min(taskCount, 6))}</span>
        </button>
    );
};

export default WeekDayCard;
