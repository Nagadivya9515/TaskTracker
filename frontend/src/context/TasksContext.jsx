// context/TasksContext.jsx
import { createContext, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const TasksContext = createContext();

export function TasksProvider({ children }) {
  const planned = useState([]);
  const checklist = useState([]);
  const [timers, setTimers] = useLocalStorage('timerTasks', []);
  const [notes, setNotes] = useLocalStorage('notes', []);
  const [alarm, setAlarm] = useLocalStorage("alarmTasks", []);
  const alarmAudioRef = useRef(null);

  // initialize alarms
useEffect(() => {
  let changed = false;
  const copy = alarm.map(a => {
    if (!a.nextTime) {
      changed = true;
      return { ...a, nextTime: Date.now() + (a.interval || 1) * 60000 };
    }
    return a;
  });
  if (changed) setAlarm(copy);
}, []);

// alarm engine
useEffect(() => {
  const id = setInterval(() => {
    const now = Date.now();
    let changed = false;

    const copy = alarm.map(a => {
      if (now >= a.nextTime) {
        alarmAudioRef.current?.play().catch(() => {});
        changed = true;
        return { ...a, nextTime: now + (a.interval || 1) * 60000 };
      }
      return a;
    });

    if (changed) setAlarm(copy);
  }, 10000);
return () => clearInterval(id);
}, [alarm]);

  function resetTasks() {
    planned[1]([]);
    checklist[1]([]);
  }


  async function fetchPlannedTasks(token) {

      const view_tasks = await axios.get("http://localhost:4000/view-planned-tasks", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      planned[1](view_tasks.data.tasks);
  }

  async function fetchChecklistTasks(token) {
    
    const view_tasks = await axios.get("http://localhost:4000/view-checklist-tasks", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    checklist[1](view_tasks.data.tasks);
  }
  return (
    <TasksContext.Provider value={{
      planned,
      checklist,
      fetchPlannedTasks,
      fetchChecklistTasks,
      resetTasks,
      timer: [timers, setTimers],
      alarm: [alarm, setAlarm],
      note: [notes, setNotes],
    }}>
      <audio ref={alarmAudioRef} src="/alarm.mp3" preload="auto" />
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  return useContext(TasksContext);
}
// import React, { createContext, useContext, useEffect, useState } from 'react';
// import axios from 'axios';
// import { useAuth } from './AuthContext';

// const TasksContext = createContext();

// export function TasksProvider({ children }) {
//   const { token } = useAuth();

//   // Task states
//   const [planned, setPlanned] = useState([]);
//   const [checklist, setChecklist] = useState([]);
//   const [alarms, setAlarms] = useState([]);
//   const [timers, setTimers] = useState([]);
//   const [notes, setNotes] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // ===== CLEAR FUNCTION =====
//   function clearAllTasks() {
//     setPlanned([]);
//     setChecklist([]);
//     setAlarms([]);
//     setTimers([]);
//     setNotes([]);
//   }

//   // ===== FETCH FUNCTIONS =====
//   async function fetchPlannedTasks() {
//     if (!token) return;
//     try {
//       setLoading(true);
//       const res = await axios.get('http://localhost:4000/planned-tasks', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setPlanned(res.data);
//     } catch (err) {
//       console.error('Failed to fetch planned tasks', err);
//       setPlanned([]);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function fetchChecklistTasks() {
//     if (!token) return;
//     try {
//       const res = await axios.get('http://localhost:4000/checklist-tasks', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setChecklist(res.data);
//     } catch (err) {
//       console.error('Failed to fetch checklist tasks', err);
//       setChecklist([]);
//     }
//   }

//   async function fetchAlarms() {
//     if (!token) return;
//     try {
//       const res = await axios.get('http://localhost:4000/alarm-tasks', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setAlarms(res.data);
//     } catch (err) {
//       console.error('Failed to fetch alarms', err);
//       setAlarms([]);
//     }
//   }

//   async function fetchTimers() {
//     if (!token) return;
//     try {
//       const res = await axios.get('http://localhost:4000/timer-tasks', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setTimers(res.data);
//     } catch (err) {
//       console.error('Failed to fetch timers', err);
//       setTimers([]);
//     }
//   }

//   async function fetchNotes() {
//     if (!token) return;
//     try {
//       const res = await axios.get('http://localhost:4000/notes', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setNotes(res.data);
//     } catch (err) {
//       console.error('Failed to fetch notes', err);
//       setNotes([]);
//     }
//   }

//   // ===== FETCH ALL TASKS WHEN TOKEN CHANGES =====
//   useEffect(() => {
//     if (!token) {
//       clearAllTasks();
//       return;
//     }

//     // Set default Authorization header
//     axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

//     fetchPlannedTasks();
//     fetchChecklistTasks();
//     fetchAlarms();
//     fetchTimers();
//     fetchNotes();
//   }, [token]);

//   return (
//     <TasksContext.Provider
//       value={{
//         planned: [planned, setPlanned],
//         checklist: [checklist, setChecklist],
//         alarms: [alarms, setAlarms],
//         timers: [timers, setTimers],
//         notes: [notes, setNotes],
//         fetchPlannedTasks,
//         fetchChecklistTasks,
//         fetchAlarms,
//         fetchTimers,
//         fetchNotes,
//         clearAllTasks,
//         loading,
//         setLoading,
//       }}
//     >
//       {children}
//     </TasksContext.Provider>
//   );
// }

// // Custom hook to use tasks
// export const useTasks = () => useContext(TasksContext);
