import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {GuestProvider} from "./components/context/GuestContext";

createRoot(document.getElementById('root')).render(

  <StrictMode>
    <GuestProvider>
    <App />
    </GuestProvider>
  </StrictMode>,
)
