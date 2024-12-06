import React, { createContext, useContext, useState, useEffect } from 'react';
import userInfo from '../mock-data/exampleUser.json'; // Example user data, if needed

// Create a User Context
const UserContext = createContext();

// Context Provider Component
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Initialize user state to null

    useEffect(() => {
        // Function to fetch user info (simulated here)
        const fetchUserInfo = () => {
            const telegramUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
            console.log(telegramUser);
            setUser(telegramUser || userInfo.user); // Use Telegram user or fallback to mock data
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
