import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Font design system (Lexend + Source Sans 3): CSS di-preload, diterapkan non-blocking
// setelah aplikasi mount — CSP-safe (tanpa inline event handler).
const FONT_CSS =
  'https://fonts.googleapis.com/css2?family=Lexend:wght@400;600;700;800;900&family=Source+Sans+3:wght@400;500;600;700&display=swap';
requestAnimationFrame(() => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = FONT_CSS;
  document.head.appendChild(link);
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
