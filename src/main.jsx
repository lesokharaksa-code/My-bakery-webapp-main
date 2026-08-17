import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // Switch back to BrowserRouter
import App from './App.jsx'
import './bakery.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename="/My-bakery-webapp-main">
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)