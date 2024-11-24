import React from 'react';

const RewardCard = () => {
    const tg = window.Telegram.WebApp;
    const initData = tg.initDataUnsafe;
    const userId = initData.user ? initData.user.id : 422999166;

    const inviteUser = () => {
        const link = `https://t.me/share/url?url=https://t.me/${initData.chat.username}/app?startapp=${userId}`
        tg.openTelegramLink(link);
    }

    return (
        <div className="reward-card bg-white shadow-md rounded-lg p-4">
            <img src="/assets/images/chest.svg" alt="chest" className="reward-image w-full h-48 object-cover rounded-t-lg" />
            <h2 className="reward-title text-xl font-semibold mt-4"></h2>
            <p className="reward-description text-gray-600 mt-2">Invite your friends and get rewards</p>
            <button
                onClick={inviteUser}
                className="redeem-button bg-blue-500 text-white py-2 px-4 rounded mt-4 hover:bg-blue-600"
            >
                Get invite link
            </button>
        </div>
    );
};

export default RewardCard;
