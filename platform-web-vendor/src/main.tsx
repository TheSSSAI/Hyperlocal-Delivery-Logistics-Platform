import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
// Assuming a global CSS file for resets and base styles exists,
// or is provided by a shared UI component library.
// If a local one is needed, it would be imported here e.g., import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Could not find the root element to bootstrap the application.");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);