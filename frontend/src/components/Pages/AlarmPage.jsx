// import React from 'react';
// import AlarmTask from '../tasks/AlarmTask';
// import { useTasks } from '../../context/TasksContext';
// import {Link} from 'react-router-dom';

// export default function AlarmPage( compact = false ) {
//   const {alarm} = useTasks();
//   const [tasks, setTasks] = alarm;
//   const [name, setName] = React.useState('');
//   const [interval, setInterval] = React.useState(1);

//   const visible = compact ? tasks.slice(0,3) : tasks;
  
//   function add() {
//     if (!name.trim()) return;
//     const iv = parseInt(interval, 10) || 1;
//     setTasks([...tasks, { name: name.trim(), interval: iv, nextTime: Date.now() + iv * 60000 }]);
//     setName('');
//     setInterval(1);
//   }

//   return (
//     <div>
//       { !compact && <h2 className="text-xl font-semibold mb-3">Alarms</h2> }
//       <div className="flex gap-2 mb-4">
//         <input value={name} onChange={e=>setName(e.target.value)} className="border px-2 py-1 rounded flex-1" placeholder="Alarm name" />
//         <input type="number" value={interval} onChange={e=>setInterval(e.target.value)} className="w-20 border px-2 py-1 rounded" />
//         <button className="small-btn bg-blue-500 text-white" onClick={add}>Add</button>
//       </div>
      
//       <ul>
//         {visible.map((t, i) => <AlarmTask key={i} task={t} index={i} tasks={tasks} setTasks={setTasks} />)}
//       </ul>

//       {compact && (
//         <Link to="/alarm" className="text-blue-500 text-sm mt-2 inline-block">
//           View all →
//         </Link>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useRef, useState } from "react";
import { useTasks } from "../../context/TasksContext";
import { Link } from "react-router-dom";

export default function AlarmPage({ compact = false }) {
  const { alarm } = useTasks();
  const [tasks, setTasks] = alarm;

  const [name, setName] = useState("");
  const [interval, setIntervalValue] = useState(1);
  const [everyday, setEveryday] = useState(false);

  const alarmAudio = useRef(new Audio("/alarm.mp3"));

  const visible = compact ? tasks.slice(0, 3) : tasks;

  /* ===============================
     CHECK ALARMS
  =============================== */
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();

      setTasks(prev =>
        prev.map(task => {
          if (!task.active || task.paused) return task;

          if (now >= task.nextTime) {
            alarmAudio.current.loop = true;
            alarmAudio.current.play();

            return {
              ...task,
              ringing: true,
              paused: true
            };
          }
          return task;
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [setTasks]);

  /* ===============================
     ADD ALARM
  =============================== */
  function addAlarm() {
    if (!name.trim()) return;

    const iv = parseInt(interval, 10) || 1;

    setTasks(prev => [
      ...prev,
      {
        name: name.trim(),
        interval: iv,
        everyday,
        nextTime: Date.now() + iv * 60000,
        active: true,
        paused: false,
        ringing: false
      }
    ]);

    setName("");
    setIntervalValue(1);
    setEveryday(false);
  }

  /* ===============================
     ACTIONS
  =============================== */
  function stopAlarm(i) {
    alarmAudio.current.pause();
    alarmAudio.current.currentTime = 0;

    setTasks(prev =>
      prev.map((t, index) =>
        index === i
          ? {
              ...t,
              ringing: false,
              paused: false,
              active: t.everyday,
              nextTime: t.everyday
                ? Date.now() + t.interval * 60000
                : null
            }
          : t
      )
    );
  }

  function snoozeAlarm(i) {
    alarmAudio.current.pause();
    alarmAudio.current.currentTime = 0;

    setTasks(prev =>
      prev.map((t, index) =>
        index === i
          ? {
              ...t,
              ringing: false,
              paused: false,
              nextTime: Date.now() + 5 * 60000
            }
          : t
      )
    );
  }

  function togglePause(i) {
    setTasks(prev =>
      prev.map((t, index) =>
        index === i
          ? { ...t, paused: !t.paused }
          : t
      )
    );
  }

  function deleteAlarm(i) {
    alarmAudio.current.pause();
    alarmAudio.current.currentTime = 0;
    setTasks(prev => prev.filter((_, index) => index !== i));
  }

  /* ===============================
     UI
  =============================== */
  return (
    <div>
      {!compact && (
        <h2 className="text-xl font-semibold mb-3">⏰ Alarms</h2>
      )}

      {/* ADD */}
      <div className="flex gap-2 mb-4 items-center">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          className="border px-2 py-1 rounded flex-1"
          placeholder="Alarm name"
        />

        <input
          type="number"
          min="1"
          value={interval}
          onChange={e => setIntervalValue(e.target.value)}
          className="w-20 border px-2 py-1 rounded"
        />

        <label className="flex items-center gap-1 text-sm">
          <input
            type="checkbox"
            checked={everyday}
            onChange={() => setEveryday(prev => !prev)}
          />
          Daily
        </label>

        <button
          className="bg-blue-500 text-white px-3 py-1 rounded"
          onClick={addAlarm}
        >
          Add
        </button>
      </div>

      {/* LIST */}
      <ul className="space-y-2">
        {visible.map((task, i) => (
          <li key={i} className="border rounded p-3 space-y-1">
            <div className="flex justify-between">
              <strong>{task.name}</strong>
              <span className="text-xs text-gray-500">
                every {task.interval} min
              </span>
            </div>

            {task.ringing ? (
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => snoozeAlarm(i)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Snooze
                </button>
                <button
                  onClick={() => stopAlarm(i)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Stop
                </button>
              </div>
            ) : (
              <div className="flex gap-3 text-sm mt-2">
                <button
                  onClick={() => togglePause(i)}
                  className="text-blue-500 hover:underline"
                >
                  {task.paused ? "Resume" : "Pause"}
                </button>

                <button
                  onClick={() => deleteAlarm(i)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {compact && (
        <Link to="/alarm" className="text-blue-500 text-sm mt-2 inline-block">
          View all →
        </Link>
      )}
    </div>
  );
}
