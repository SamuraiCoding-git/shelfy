import React, {useEffect} from 'react';
import {useUser} from "../context/UserContext.jsx";
import {useNavigate} from "react-router-dom";

const UserProfile = () => {
    const user = useUser();
    const tg = window.Telegram.WebApp;
    const navigate = useNavigate();

    const inviteUser = () => {
        const link = `https://t.me/share/url?url=https://t.me/shelfy_bot_bot/app?startapp=${user.id}`;
        tg.openTelegramLink(link);
    };

    return (
        <section className="profile container p-4">
            <div className="relative flex justify-center mb-4">
                <button className="absolute top-0 left-0 p-2" onClick={() => navigate("/")}>
                    <img src="/assets/icons/profile/chevron-left.svg" alt="go back" />
                </button>
                <div className="avatar">
                    <img
                        src={user.photo_url}
                        alt="image profile"
                        className="user-avatar w-28 h-28 rounded-full"
                    />
                </div>
            </div>

            <div className="user-name text-center text-primary font-bold text-2xl mb-3">
                {user.first_name ? `${user.first_name} ${user.last_name}` : user.name}
            </div>

            <div className="user-acquisition-statistics-wrapper text-center text-primary font-medium text-base mb-4 flex justify-evenly">
                <div className="user-acquisition-statistics flex flex-col items-center justify-center gap-2">
                    <p>{user.friends}</p>
                    <p className="secondary-text">friends</p>
                </div>

                <div className="divider bg-secondary-text w-px h-full"></div>

                <div className="user-acquisition-statistics flex flex-col items-center justify-center gap-2">
                    <p>{user.invitation}</p>
                    <p className="secondary-text">invitation</p>
                </div>

                <div className="divider bg-secondary-text w-px h-full"></div>

                <div className="user-acquisition-statistics flex flex-col items-center justify-center gap-2">
                    <p>{user.achievements}</p>
                    <p className="secondary-text">achievements</p>
                </div>
            </div>

            <button
                className="invite-button w-full py-4 bg-custom-blue text-primary-text font-semibold text-xl rounded-xl mb-6"
                onClick={inviteUser}
            >
                Invite a friend +200x
            </button>

            <h1 className="text-primary font-bold text-2xl mb-3">Your Statistics</h1>

            <div className="statistics-card-wrapper grid grid-cols-2 gap-3 mb-6"> {/* Увеличили общий gap */}
                <div
                    className="statistics-card bg-gray-800 text-primary rounded-xl p-4 flex items-center gap-3 font-bold text-lg"> {/* Увеличили gap между иконкой и текстом */}
                    <img src="/assets/icons/profile/fire.svg" alt="fire icon"/>
                    <div className="statistics-card-info flex flex-col gap-1"> {/* Увеличили gap между текстом */}
                        <p className="leading-relaxed">{user.burningDays}</p> {/* Увеличенный межстрочный интервал */}
                        <p className="secondary-text text-[#AEAEB4] text-[14px] leading-3">Shock mode</p>
                    </div>
                </div>

                <div
                    className="statistics-card bg-gray-800 text-primary rounded-xl p-4 flex items-center gap-3 font-bold text-lg">
                    <img src="/assets/icons/profile/diamond.svg" alt="diamond icon"/>
                    <div className="statistics-card-info flex flex-col gap-1">
                        <p className="leading-relaxed">{user.tokenBalance}</p>
                        <p className="secondary-text text-[#AEAEB4] text-[14px] leading-3">XP points</p>
                    </div>
                </div>

                <div
                    className="statistics-card bg-gray-800 text-primary rounded-xl p-4 flex items-center gap-3 font-bold text-lg">
                    <img src="/assets/icons/gold_achievements.svg" alt="gold icon" style={{width: '32px'}}/>
                    <div className="statistics-card-info flex flex-col gap-1">
                        <p className="leading-relaxed">{user.currentLeague}</p>
                        <p className="secondary-text text-[#AEAEB4] text-[14px] leading-3">Current league</p>
                    </div>
                </div>

                <div
                    className="statistics-card bg-gray-800 text-primary rounded-xl p-4 flex items-center gap-3 font-bold text-lg">
                    <img src="/assets/icons/profile/aim.svg" alt="aim icon"/>
                    <div className="statistics-card-info flex flex-col gap-1">
                        <p className="leading-relaxed">{user.taskCompleted}</p>
                        <p className="secondary-text text-[#AEAEB4] text-[14px] leading-3">Task completed</p>
                    </div>
                </div>
            </div>


            <div className="achievements-navigation-wrapper flex justify-between items-center mb-3">
                <h1 className="text-primary font-bold text-2xl mb-0">Your Achievements</h1>
                <button className="next-button p-2">
                    <img src="/assets/icons/profile/arrow-right.svg" alt="go next"/>
                </button>
            </div>

            <div className="league-card-wrapper flex gap-2">
                <div className="league-card bg-gray-800 rounded-xl p-3 w-full flex justify-center">
                    <img src="/assets/icons/profile/gold-league.svg" alt="gold league"/>
                </div>
                <div className="league-card bg-gray-800 rounded-xl p-3 w-full flex justify-center">
                    <img src="/assets/icons/profile/silver-league.svg" alt="silver league"/>
                </div>
                <div className="league-card bg-gray-800 rounded-xl p-3 w-full flex justify-center">
                    <img src="/assets/icons/profile/bronze-league.svg" alt="bronze league"/>
                </div>
            </div>
        </section>
    );
};

export default UserProfile;
