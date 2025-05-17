import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';  // Corrected path to App
import { AuthProvider } from './context/AuthContext.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);