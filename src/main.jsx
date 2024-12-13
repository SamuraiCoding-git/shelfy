import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { TodoProvider } from "./context/TodoContext.jsx";
import { TagsProvider } from "./context/TagsContext.jsx";
import { UserProvider } from "./context/UserContext.jsx";

// Get startParam dynamically from Telegram WebApp
const startParam = window.Telegram.WebApp.initDataUnsafe.start_param;

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <UserProvider startParam={startParam}>
            <TodoProvider>
                <TagsProvider>
                    <App />
                </TagsProvider>
            </TodoProvider>
        </UserProvider>
    </StrictMode>,
);
