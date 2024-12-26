import React, { useState } from 'react';
import WeekDayCard from './WeekDayCard';
import { useTodos } from "../context/TodoContext.jsx";

const WeekDays = () => {
    const today = new Date();
    const [selectedDay, setSelectedDay] = useState(today);
    const { allTodos, setSelectedDate } = useTodos(); // Используем все задачи для фильтрации

    // Generate 7 days starting from today
    const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
        const day = new Date(today);
        day.setDate(today.getDate() + i);
        return day;
    });

    // Filter tasks for a specific day
    const getTaskCountForDay = (day) => {
        const dayString = day.toDateString();
        return allTodos.filter((todo) => new Date(todo.time).toDateString() === dayString).length;
    };

    const handleDayClick = (day) => {
        setSelectedDay(day); // Обновление локального состояния
        setSelectedDate(day); // Установка выбранной даты в контексте
    };

    return (
        <div className="flex overflow-x-auto gap-4 scrollbar-hide overflow-y-hidden">
            {daysOfWeek.map((day, index) => (
                <WeekDayCard
                    key={index}
                    day={day}
                    isSelected={selectedDay?.toDateString() === day.toDateString()}
                    taskCount={getTaskCountForDay(day)} // Задачи только для текущего дня
                    onClick={() => handleDayClick(day)} // Обновление при клике
                />
            ))}
        </div>
    );
};

export default WeekDays;
