import React from 'react';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import Navigation from './components/Navigation';
import Features from "./pages/Features.jsx";
import Calendar from "./pages/Calendar.jsx";
import UserProfile from "./pages/Profile.jsx";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<Navigation />}>
            <Route path="/" element={<Home />} />
            <Route path="/features" element={<Features />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/profile" element={<UserProfile />} />
        </Route>
    )
);

function App() {
    const tg = window.Telegram.WebApp;
    tg.expand();
    return <RouterProvider router={router} />;
}

export default App;
