import React, { useState } from 'react';
import WeekDayCard from './WeekDayCard';
import mockData from '../mock-data/exampleTodoList.json'

const WeekDays = () => {
    const today = new Date();
    const [selectedDay, setSelectedDay] = useState(today);
    const todos = mockData.todos;


    // Generate 7 days starting from today
    const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
        const day = new Date(today);
        day.setDate(today.getDate() + i);
        return day;
    });

    // Count tasks for each day
    const getTaskCountForDay = (day) => {
        return todos.filter((todo) => {
            const todoDate = new Date(todo.time).toDateString();
            return todoDate === day.toDateString();
        }).length;
    };

    const handleDayClick = (day) => {
        setSelectedDay(day);
    };

    return (
        <div className="flex overflow-x-auto gap-4 scrollbar-hide overflow-y-hidden">
            {daysOfWeek.map((day, index) => (
                <WeekDayCard
                    key={index}
                    day={day}
                    isSelected={selectedDay?.toDateString() === day.toDateString()}
                    taskCount={getTaskCountForDay(day)}
                    onClick={() => handleDayClick(day)}
                />
            ))}
        </div>
    );
};

export default WeekDays;
