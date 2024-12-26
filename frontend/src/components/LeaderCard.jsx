import React from "react";

const LeaderCard = ({ user, rank }) => {
    // Format token balance with postfix 'k', 'M', or 'B'
    const formatTokenBalance = (balance) => {
        if (balance >= 1_000_000_000) {
            return (balance / 1_000_000_000).toFixed(1) + "B"; // for billions
        } else if (balance >= 1_000_000) {
            return (balance / 1_000_000).toFixed(1) + "M"; // for millions
        } else if (balance >= 1000) {
            return (balance / 1000).toFixed(1) + "k"; // for thousands
        }
        return balance; // for numbers less than 1000
    };

    return (
        <div className="p-4 rounded-xl shadow-sm flex items-center bg-[#1E1F24]">
            {/* Display Rank */}
            <span className="text-white font-semibold">{`#${rank}`}</span>

            {/* Avatar Image */}
            <img
                src={user.photo_url}
                alt={`${user.full_name}'s avatar`}
                className="w-12 h-12 rounded-full ml-4"  // Add margin-left to move the avatar slightly to the right
            />

            {/* Display Name */}
            <span className="font-medium text-lg text-white ml-4">{user.full_name}</span> {/* Move name more to the left */}

            {/* Display Token Balance */}
            <span className="text-white ml-auto">{`${formatTokenBalance(user.earnings)} points`}</span> {/* Move token balance to the far right */}
        </div>
    );
};

export default LeaderCard;
