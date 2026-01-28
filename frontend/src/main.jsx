import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import {LoadingProvider} from './context/LoadingContext';
import { AuthProvider } from './context/AuthContext';
import './index.css';
import { TasksProvider } from './context/TasksContext';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <LoadingProvider>
          <TasksProvider>
            <App />
        </TasksProvider>
      </LoadingProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);