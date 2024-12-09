import React, { useEffect } from 'react';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import Navigation from './components/Navigation';
import Features from "./pages/Features.jsx";
import Calendar from "./pages/Calendar.jsx";
import UserProfile from "./pages/Profile.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
import axios from 'axios';

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<Navigation />}>
            <Route path="/" element={<Home />} />
            <Route path="/features" element={<Features />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
        </Route>
    )
);

function App() {
    useEffect(() => {
        if (window.Telegram && window.Telegram.WebApp) {
            // Request write access for the Telegram WebApp
            try {
                window.Telegram.WebApp.requestWriteAccess();
            } catch (e) {
                console.error("Error requesting write access:", e);
            }

            // Expand the WebApp
            window.Telegram.WebApp.expand();
        }
        axios.post('https://6ac0-46-183-186-2.ngrok-free.app/api/users/', {
            userInitData: window.Telegram.WebApp.initData,
            startParam: window.Telegram.WebApp.initDataUnsafe.start_param,
        }, {
            headers: {
                'ngrok-skip-browser-warning': 'true', // Skips ngrok browser warning
                'Content-Type': 'application/json'   // Ensures correct content-type header
            }
        })
            .then(response => {
                console.log('Response:', response.data);
            })
            .catch(error => {
                console.error('Error:', error.response ? error.response.data : error.message);
            });

    }, []); // Empty dependency array ensures this runs only once when the component mounts

    return <RouterProvider router={router} />;
}

export default App;
