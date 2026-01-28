import { useEffect, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Verifyotp from './components/Verify-otp';
import ForgotPassword from './components/Forgot-password';
import ResetPassword from './components/Reset-password';
import { useLoading } from './context/LoadingContext';
import Loader from './components/Loader';
import ResendOtp from './components/Resend-otp';
import React from 'react';
import AlarmPage from './components/Pages/AlarmPage';
import ChecklistPage from './components/Pages/ChecklistPage';
import NotesPage from './components/Pages/NotesPage';
import PlannedPage from './components/Pages/PlannedPage';
import TimerPage from './components/Pages/TimerPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import { useTasks } from './context/TasksContext';

export default function App() {
  
  const {loading} = useLoading();
  const { token, authReady } = useAuth();
  const { resetTasks, fetchPlannedTasks } = useTasks();
  
  useEffect(() => { 
    if(!authReady) return;
    if (!token) {
      resetTasks();
    }
    else {
      fetchPlannedTasks(token);
    }
  }, [token, authReady]);

  if (!authReady) {
    return <p>Initializing app...</p>; // ⏳ prevents race condition
  }
  return (
    <>
    {loading && <Loader />}
    <div>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<Verifyotp />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password' element={<ResetPassword />} />
          <Route path='/resend-otp' element={<ResendOtp />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/alarm" element={<AlarmPage />} />
            <Route path="/planned" element={<PlannedPage />} />
            <Route path="/checklist" element={<ChecklistPage />} />
            <Route path="/timer" element={<TimerPage />} />
            <Route path="/notes" element={<NotesPage />} />
          </Route>
        </Routes>
      </div>
    </div>
    </>
  );
}