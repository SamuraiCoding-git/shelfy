import React, { useState, useEffect } from "react";
import TodoList from "../components/TodoList.jsx";
import { useTodos } from "../context/TodoContext";

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const { setSelectedDate, allTodos } = useTodos(); // Get allTodos from context
    const today = new Date();

    // Function to get days in the current month
    const getDaysInMonth = (date) => {
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const firstDay = startOfMonth.getDay() === 0 ? 6 : startOfMonth.getDay() - 1; // Adjust to match Monday-Sunday calendar
        const lastDate = endOfMonth.getDate();

        const days = Array.from({ length: lastDate }, (_, i) => i + 1);

        const prevMonthEnd = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
        const emptyDays = Array.from({ length: firstDay }, (_, i) => prevMonthEnd - firstDay + i + 1);

        return [...emptyDays.map((day) => ({ day, isCurrentMonth: false })), ...days.map((day) => ({ day, isCurrentMonth: true }))];
    };

    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const daysInMonth = getDaysInMonth(currentDate);

    // Check if the day is selected
    const isSelected = (day) => {
        const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        return selectedDate.toDateString() === currentDate.toDateString();
    };

    // Handle selecting a date
    const handleSelectDate = (day, isCurrentMonth) => {
        if (isCurrentMonth && day) {
            const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            setCurrentDate(newDate);
            setSelectedDate(newDate);  // Update selectedDate in context
        }
    };

    // Change to previous month
    const handlePrevMonth = () => {
        const prevMonth = new Date(currentDate);
        prevMonth.setMonth(prevMonth.getMonth() - 1);
        setCurrentDate(prevMonth);
    };

    // Change to next month
    const handleNextMonth = () => {
        const nextMonth = new Date(currentDate);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        setCurrentDate(nextMonth);
    };

    // Format the month and year
    const formatMonthYear = (date) => {
        const options = { year: "numeric", month: "short" };
        return new Intl.DateTimeFormat("en-US", options).format(date);
    };

    // Function to get tags for a specific day
    const getTagsForDay = (day) => {
        const tags = allTodos
            .filter(todo => new Date(todo.time).getDate() === day && new Date(todo.time).getMonth() === currentDate.getMonth() && new Date(todo.time).getFullYear() === currentDate.getFullYear())  // Filter todos for the current day, month, and year
            .flatMap(todo => todo.tags || [])  // Ensure that 'tags' exists before flattening
            .slice(0, 5);  // Limit to 5 tags
        return tags;
    };

    // Function to get tags for the entire month
    const getTagsForMonth = () => {
        const tagsForMonth = [];
        daysInMonth.forEach(({ day, isCurrentMonth }) => {
            if (isCurrentMonth) {
                const tagsForDay = getTagsForDay(day);
                if (tagsForDay.length > 0) {
                    tagsForMonth.push({ day, tags: tagsForDay });
                }
            }
        });
        return tagsForMonth;
    };

    const tagsForMonth = getTagsForMonth();

    const validDate = currentDate instanceof Date && !isNaN(currentDate);
    if (!validDate) {
        console.error("Invalid currentDate provided to Calendar");
        return <div>Invalid Date</div>;
    }

    return (
        <>
            <div className="flex items-center justify-between w-full mt-4">
                <span className="text-white text-lg font-semibold ml-4">
                    {formatMonthYear(currentDate)}
                </span>
                <div className="flex items-center space-x-2 mr-4">
                    <button
                        onClick={handlePrevMonth}
                        disabled={currentDate.getFullYear() === today.getFullYear() && currentDate.getMonth() === today.getMonth()}
                    >
                        <img src="/assets/icons/task/chevron-left.svg" alt="Previous month" className="w-5 h-5"/>
                    </button>
                    <button onClick={handleNextMonth}>
                        <img src="/assets/icons/task/chevron-right.svg" alt="Next month" className="w-5 h-5"/>
                    </button>
                </div>
            </div>
            <div className="mt-6 grid grid-cols-7 gap-1 text-white text-[16px]">
                {weekdays.map((day, index) => (
                    <div key={index} className="text-center text-[#AEAEB4]">
                        {day}
                    </div>
                ))}

                {daysInMonth.map(({ day, isCurrentMonth }, index) => (
                    <div
                        key={index}
                        className={`
                            p-2 cursor-pointer ml-2 mt-2
                            ${isCurrentMonth
                            ? 'bg-[#1E1F24] hover:bg-custom-blue'
                            : 'text-[#47474E] bg-transparent cursor-not-allowed'
                        }
                            ${day === today.getDate() && isCurrentMonth ? 'text-custom-blue hover:text-white' : ''}
                            ${isSelected(day) && isCurrentMonth ? 'bg-custom-blue text-white' : ''}
                            w-12 h-12 rounded-xl font-bold
                            flex items-center justify-center
                            ${isCurrentMonth ? 'border border-transparent hover:ring-2 hover:ring-custom-blue' : ''}
                            relative
                        `}
                        onClick={() => {
                            if (isCurrentMonth) { // Only handle click for current month
                                handleSelectDate(day, isCurrentMonth);
                            }
                            console.log(`Day ${day} clicked. Selected: ${isSelected(day)}`);
                        }}
                    >
                        <div>
                            {day}
                            {/* Centering the tag circles relative to the cell */}
                            <div className="absolute -mb-2 bottom-0 left-1/2 transform -translate-x-1/2 flex justify-center space-x-0.5">
                                {isCurrentMonth && getTagsForDay(day).map((tag, tagIndex) => (
                                    <div
                                        key={tagIndex}
                                        className="w-1 h-1 rounded-full"
                                        style={{ backgroundColor: tag.color }} // Use the color from the tag
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <TodoList isCalendarPage={true}/>
        </>
    );
};

export default Calendar;
