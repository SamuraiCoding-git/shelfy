import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import LeaderCard from "../components/LeaderCard.jsx";

const Leaderboard = () => {
    const [activeCategory, setActiveCategory] = useState("weekly"); // Tracks the current leaderboard type
    const [users, setUsers] = useState([]); // To store the leaderboard data
    const [loading, setLoading] = useState(false); // To manage the loading state
    const [error, setError] = useState(null); // To manage any errors

    // Function to handle category changes
    const handleCategoryChange = (category) => {
        setActiveCategory(category);
    };

    // Function to get active category styling
    const getActive = (category) => {
        return activeCategory === category;
    };

    // Fetch leaderboard data based on the active category
    useEffect(() => {
        const fetchLeaderboardData = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axios.post(
                    `https://shelfy.website/api/users/top_earnings?period=${activeCategory}`,
                    {
                        headers: {
                            'ngrok-skip-browser-warning': 'true', // Skips ngrok browser warning
                            'Content-Type': 'application/json',    // Ensures correct content-type header
                        }
                    }
                );

                // Assuming the response contains `top_users`
                setUsers(response.data.top_users); // Set the users based on the fetched data
            } catch (error) {
                setError(error.message); // Set error if any occurs
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboardData();
    }, [activeCategory]); // Fetch data every time activeCategory changes

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
            {loading ? (
                <p>Loading...</p> // Show loading state
            ) : error ? (
                <p className="text-red-500">{error}</p> // Show error message
            ) : (
                <div className="flex flex-col gap-2">
                    {users && users.length > 0 ? (
                        users.map((user, index) => (
                            <LeaderCard key={index} user={user} rank={index + 1} />
                        ))
                    ) : (
                        <p>No users available</p>
                    )}
                </div>
            )}
        </section>
    );
};

export default Leaderboard;
