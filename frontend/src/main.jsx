import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { TodoProvider } from "./context/TodoContext.jsx";
import { TagsProvider } from "./context/TagsContext.jsx";
import { UserProvider } from "./context/UserContext.jsx";


createRoot(document.getElementById('root')).render(
    <StrictMode>
        <UserProvider>
            <TodoProvider>
                <TagsProvider>
                    <App />
                </TagsProvider>
            </TodoProvider>
        </UserProvider>
    </StrictMode>,
);
