import React, { createContext, useContext, useState, useEffect } from 'react';
import userInfo from '../mock-data/exampleUser.json'; // Example user data, if needed

// Create a User Context
const UserContext = createContext();

// Context Provider Component
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Initialize user state to null

    useEffect(() => {
        const fetchUserInfo = () => {
            const telegramUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
            console.log(telegramUser);

            if (telegramUser) {
                console.log("Telegram user found:", telegramUser);

                // Merge additional properties with the telegramUser
                const extendedUser = {
                    ...telegramUser,
                    friends: 5,
                    invitation: 12,
                    achievements: 3,
                    currentLeague: "Gold",
                    taskCompleted: 120,
                    burningDays: 365,
                    tokenBalance: 12021
                };

                setUser(extendedUser);
            } else {
                console.log("Telegram user undefined. Falling back to mock data:", userInfo.user);
                setUser(userInfo.user);
            }
        };

        fetchUserInfo(); // Fetch user info on component mount
    }, []);


    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to access UserContext
export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
