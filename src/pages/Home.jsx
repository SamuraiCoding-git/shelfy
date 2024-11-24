import React, { useState } from 'react'
import WeekDays from "../components/WeekDays.jsx";
import UserStatistics from "../components/UserStatistics.jsx";
import RewardCard from "../components/RewardCard.jsx";
import ProgressCard from "../components/ProgressCard.jsx";


const Home = () => {
    return (
        <div>
            <div className="p-4 flex flex-col gap-8">
                <UserStatistics/>
                <WeekDays className="mt-4"/>
                {/*<RewardCard/>*/}
                <ProgressCard progress={60}/>
            </div>
        </div>
    );
};

export default Home;
