import React, { useState } from 'react';
import WeekDayCard from './WeekDayCard';

const WeekDays = () => {
    const today = new Date();
    const [selectedDay, setSelectedDay] = useState(null);

    const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
        const day = new Date(today);
        day.setDate(today.getDate() + i);
        return day;
    });

    const handleDayClick = (day) => {
        setSelectedDay(day);
    };

    return (
        <div className="flex overflow-x-auto gap-4 scrollbar-hide">
            {daysOfWeek.map((day, index) => (
                <WeekDayCard
                    key={index}
                    day={day}
                    isSelected={selectedDay?.toDateString() === day.toDateString()}
                    onClick={() => handleDayClick(day)}
                />
            ))}
        </div>
    );
};

export default WeekDays;
