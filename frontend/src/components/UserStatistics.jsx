import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from "../context/UserContext.jsx";

const UserStatistics = () => {
    const { user } = useUser();
    const navigate = useNavigate();

    // Function to format numbers with commas
    const formatNumber = (num) => num?.toLocaleString();

    // Early return if user is null or undefined
    if (!user) {
        return <div>Loading...</div>; // or any loading fallback UI you prefer
    }

    const openProfile = () => {
        navigate(`/profile`);
    };

    return (
        <header className="flex justify-between items-center">
            {/* User balance */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                    <img
                        src="/assets/icons/fire.svg"
                        alt="days in fire icon"
                        className="w-8"
                    />
                    {/* Safely access user.burningDays */}
                    <span className="text-lg font-bold">{formatNumber(user.burningDays)}</span>
                </div>
                <div className="flex items-center gap-3">
                    <img
                        src="/assets/icons/diamond_header.svg"
                        alt="token balance icon"
                        className="w-8"
                    />
                    {/* Safely access user.points */}
                    <span className="text-lg font-bold">{formatNumber(user.points)}</span>
                </div>
            </div>
            {/* Profile button */}
            <button
                className="flex justify-center items-center w-12 h-12 rounded-full overflow-hidden"
                onClick={openProfile}
            >
                {/* Safely access user.photo_url */}
                <img
                    src={user.photo_url || '/path/to/default-image.png'} // Fallback image if photo_url is missing
                    alt="profile"
                    className="w-full h-full object-cover rounded-full"
                />
            </button>
        </header>
    );
};

export default UserStatistics;
