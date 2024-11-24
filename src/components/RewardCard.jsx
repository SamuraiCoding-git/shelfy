import React from 'react';

const RewardCard = () => {
    const tg = window.Telegram.WebApp;
    const initData = tg.initDataUnsafe;
    const userId = initData.user ? initData.user.id : 422999166;

    const inviteUser = () => {
        const link = `https://t.me/share/url?url=https://t.me/${initData.chat.username}/app?startapp=${userId}`;
        tg.openTelegramLink(link);
    };

    return (
        <div className="relative bg-[#1e79ff] flex h-[158px] text-white rounded-[24px]">
            <div className="w-[60%] p-[24px_0_24px_24px] flex flex-col gap-[14px] justify-start z-[1]">
                <h2 className="text-[20px] font-bold leading-[27px]">Invite Friends</h2>
                <p className="inline text-[rgba(255,255,255,0.6)]">
                    Invite your friends and get rewards
                </p>
                <button
                    onClick={inviteUser}
                    className="w-[154px] p-[4px_24px] bg-white text-[#1e79ff] text-[16px] font-semibold leading-[26px] rounded-[12px]"
                >
                    Get invite link
                </button>
            </div>
            <div className="relative w-[182px] rounded-[24px]">
                <img
                    src="/assets/images/chest.svg"
                    alt="chest"
                    className="absolute top-0 right-0 rounded-[24px] object-contain"
                />
            </div>
        </div>
    );
};

export default RewardCard;
