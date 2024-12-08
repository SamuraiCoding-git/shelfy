import React, {useEffect} from 'react';
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

useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
        // Alternatively to what can be set with react-telegram-web-app, you can directly set the following properties:
        try {
            window.Telegram.WebApp.requestWriteAccess()
        } catch (e) {
            console.log(e)
        }
        window.Telegram.WebApp.expand()
    }
    axios.post('https://6ac0-46-183-186-2.ngrok-free.app/users', initData)
        .then(response => {
            console.log('Response:', response.data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}, [])

function App() {
    const tg = window.Telegram.WebApp;
    tg.expand();
    return <RouterProvider router={router} />;
}

export default App;
