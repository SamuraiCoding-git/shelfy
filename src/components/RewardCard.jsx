import React from 'react';

const RewardCard = () => {
    const tg = window.Telegram.WebApp;
    const initData = tg.initDataUnsafe;
    const userId = initData.user ? initData.user.id : 422999166;

    const inviteUser = () => {
        const link = `https://t.me/share/url?url=https://t.me/shelfy_bot_bot/app?startapp=${userId}`;
        tg.openTelegramLink(link);
    };

    return (
        <div className="relative bg-[#1e79ff] flex h-[158px] text-white rounded-[24px] overflow-hidden">
            <div className="relative z-10 w-[60%] p-[24px_0_24px_24px] flex flex-col gap-[14px] justify-start">
                <p className="text-[20px] font-bold leading-[27px]">
                    Invite your friends and get{' '}
                    <a className="inline text-[rgba(255,255,255,0.6)]">rewards</a>
                </p>
                <button
                    onClick={inviteUser}
                    className="w-[154px] p-[4px_24px] bg-white text-[#1e79ff] text-[16px] font-semibold leading-[26px] rounded-[12px]"
                >
                    Get invite link
                </button>
            </div>
            <img
                src="/assets/images/chest.svg"
                alt="chest"
                className="absolute top-0 right-0 h-full object-contain"
            />
        </div>
    );
};

export default RewardCard;
