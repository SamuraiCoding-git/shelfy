import React from 'react';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import Navigation from './components/Navigation';

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<Navigation />}>
            <Route path="/" element={<Home />} />
            {/* Add more routes here as needed */}
        </Route>
    )
);

function App() {
    const tg = window.Telegram.WebApp;
    tg.expand();
    return <RouterProvider router={router} />;
}

export default App;
