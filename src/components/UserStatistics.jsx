import React from 'react';
import mockData from '../mock-data/exampleUser.json';
import { useNavigate } from 'react-router-dom';

const UserStatistics = () => {
    const user = mockData.user;
    const formatNumber = (num) => num?.toLocaleString();
    const navigate = useNavigate();

    const openProfile = () => {
        navigate(`/profile/${user.id}`); // Assuming `user.id` is available
    };

    return (
        <header className="flex justify-between items-center">
            {/* User balance */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                    <img
                        src="/assets/icons/fire.svg"
                        alt="days in fire icon"
                        className="w-6" // Icon width: 24px
                    />
                    <span className="text-lg font-medium">{formatNumber(user.burningDays)}</span>
                </div>
                <div className="flex items-center gap-3">
                    <img
                        src="/assets/icons/diamond_header.svg"
                        alt="token balance icon"
                        className="w-6" // Icon width: 24px
                    />
                    <span className="text-lg font-medium">{formatNumber(user.tokenBalance)}</span>
                </div>
            </div>
            {/* Profile button */}
            <button
                className="flex justify-center items-center w-12 h-12 rounded-full overflow-hidden" // Avatar wrapper
                onClick={openProfile}
            >
                <img
                    src={user.userImageProfile}
                    alt="profile"
                    className="w-full h-full object-cover rounded-full" // Avatar styles
                    onError={(e) => (e.target.src = '/path/to/default-image.png')} // Fallback image
                />
            </button>
        </header>
    );
};

export default UserStatistics;
