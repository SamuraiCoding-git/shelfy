import React, { useState } from "react";
import LeaderCard from "../components/LeaderCard.jsx";
import mockData from "../mock-data/exampleLeaderboard.json";

const Leaderboard = () => {
    const [activeCategory, setActiveCategory] = useState("weekly"); // Tracks the current leaderboard type

    const handleCategoryChange = (category) => {
        setActiveCategory(category);
    };

    const getActive = (category) => {
        return activeCategory === category;
    };

    const users = mockData.leaderboards[activeCategory]; // Dynamically get users based on active category

    return (
        <section className="container p-4">
            <h1 className="text-center text-primary-text mb-6 text-2xl font-bold">Leaderboard</h1>
            <div className="flex gap-3 mb-6">
                <button
                    onClick={() => handleCategoryChange("weekly")}
                    className={`w-full px-6 py-2.5 rounded-full ${getActive("weekly") ? "text-white bg-custom-blue" : "text-[#1D77FF] border-8 border-[#1D77FF]"} font-semibold text-lg`}
                >
                    Weekly
                </button>
                <button
                    onClick={() => handleCategoryChange("monthly")}
                    className={`w-full px-6 py-2.5 rounded-full ${getActive("monthly") ? "text-white bg-custom-blue" : "text-[#1D77FF] border-8 border-[#1D77FF]"} font-semibold text-lg`}
                >
                    Monthly
                </button>
                <button
                    onClick={() => handleCategoryChange("allTime")}
                    className={`w-full px-6 py-2.5 rounded-full ${getActive("allTime") ? "text-white bg-custom-blue" : "text-[#1D77FF] border-8 border-[#1D77FF]"} font-semibold text-lg`}
                >
                    All Time
                </button>
            </div>
            <div className="flex flex-col gap-2">
                {users && users.length > 0 ? (
                    users.map((user, index) => (
                        <LeaderCard key={index} user={user} rank={index + 1} />
                    ))
                ) : (
                    <p>No users available</p>
                )}
            </div>
        </section>
    );
};

export default Leaderboard;
