import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {TodoProvider} from "./context/TodoContext.jsx";
import {TagsProvider} from "./context/TagsContext.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <TodoProvider>
          <TagsProvider>
            <App />
          </TagsProvider>
      </TodoProvider>
  </StrictMode>,
)
