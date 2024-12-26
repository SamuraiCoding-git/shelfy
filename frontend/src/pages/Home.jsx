import React, { useEffect, useState } from 'react';
import WeekDays from '../components/WeekDays.jsx';
import UserStatistics from '../components/UserStatistics.jsx';
import RewardCard from '../components/RewardCard.jsx';
import ProgressCard from '../components/ProgressCard.jsx';
import TodoList from '../components/TodoList.jsx';
import { useTodos } from '../context/TodoContext.jsx';

const Home = () => {
    const [progress, setProgress] = useState(0);

    // Randomly decide which card to show on page load
    const [showProgressCard] = useState(() => Math.random() < 0.5);

    const { filteredTodos } = useTodos();

    useEffect(() => {
        // Calculate progress whenever filteredTodos changes
        const completedTasks = filteredTodos.filter((todo) => todo.status).length;
        const totalTasks = filteredTodos.length;

        if (totalTasks > 0) {
            const calculatedProgress = Math.round((completedTasks / totalTasks) * 100);
            setProgress(calculatedProgress);
        } else {
            setProgress(0); // If no tasks, progress is 0
        }
    }, [filteredTodos]); // Add filteredTodos as a dependency

    return (
        <div>
            <div className="p-4 flex flex-col gap-8">
                <UserStatistics />
                <WeekDays className="mt-4" />
                {showProgressCard ? (
                    <ProgressCard progress={progress} />
                ) : (
                    <RewardCard />
                )}
            </div>
            <TodoList isCalendarPage={false} />
        </div>
    );
};

export default Home;
