import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { runtimeConfig } from './config/runtimeConfig';

// Fetch the runtime configuration before rendering the React application
runtimeConfig.load().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}).catch((error) => {
  // Discarding the app render if config fails. We can show a fallback UI or Error Component if desired.
  console.error("Critical: Failed to load application config", error);
  document.getElementById('root')!.innerHTML = `
    <div style="color: white; background-color: #1a1a1a; height: 100vh; display: flex; align-items: center; justify-content: center; font-family: sans-serif;">
      <h1>Error loading application configuration.</h1>
    </div>
  `;
});
