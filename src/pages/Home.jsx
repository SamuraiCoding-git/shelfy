import React, { useState } from 'react'
import WeekDays from "../components/WeekDays.jsx";
import UserStatistics from "../components/UserStatistics.jsx";


const Home = () => {
    return (
        <div>
            <div className="p-4 flex flex-col gap-8">
                <UserStatistics/>
                <WeekDays/>
            </div>
        </div>
    );
};

export default Home;
