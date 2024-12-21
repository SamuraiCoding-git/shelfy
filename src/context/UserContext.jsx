import React, { createContext, useContext, useState, useEffect } from 'react';
import userInfo from '../mock-data/exampleUser.json';
import axios from "axios"; // Example user data, if needed

// Create a User Context
const UserContext = createContext();

// Context Provider Component
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const initData = window.Telegram.WebApp.initDataUnsafe.user// Initialize user state to null

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.post('http://195.133.147.119/api/users/', {
                    userInitData: window.Telegram.WebApp.initData,
                    startParam: window.Telegram.WebApp.initDataUnsafe.start_param
                }, {
                    headers: {
                        'ngrok-skip-browser-warning': 'true', // Skips ngrok browser warning
                        'Content-Type': 'application/json'   // Ensures correct content-type header
                    }
                });

                const fetchedUser = response.data.user;
                console.log('Response:', response.data);

                const extendedUser = fetchedUser
                    ? { ...fetchedUser, currentLeague: "Gold", photo_url: initData.photo_url,  }
                    : { ...userInfo.user };

                console.log(extendedUser)

                setUser(extendedUser);
            } catch (error) {
                console.error('Error:', error.response ? error.response.data : error.message);
                setUser(userInfo.user); // Fallback to mock data in case of an error
            }
        };

        fetchUserInfo(); // Fetch user info on component mount
    }, []);

    const addPoints = (points) => {
        setUser((prevUser) => {
            if (prevUser && prevUser.points !== undefined) {
                return { ...prevUser, points: prevUser.points + points };
            }
            return prevUser; // If there's no points property, just return the user as is
        });
    };

    const updateTasksCompleted = () => {
        setUser((prevUser) => {
            if (prevUser && prevUser.completed_tasks !== undefined) {
                return { ...prevUser, completed_tasks: prevUser.completed_tasks + 1 };
            }
            return prevUser; // If tasksCompleted doesn't exist, just return the user as is
        });
    };

    return (
        <UserContext.Provider
            value={{
                user,
                addPoints,
                updateTasksCompleted
            }}
        >
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
