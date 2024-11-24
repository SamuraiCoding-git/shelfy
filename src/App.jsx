import React from 'react';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route>
            <Route>
                <Route path="/" element={<Home />} />
            </Route>
        </Route>
    )
);

function App() {
    return <RouterProvider router={router} />;
}

export default App;