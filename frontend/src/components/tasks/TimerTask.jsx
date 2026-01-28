import React, { useEffect, useState } from 'react';
import { formatDuration } from '../../utils/format';

export default function TimerTask({ task, index, tasks, setTasks }) {
  const [, setTick] = useState(0);

  useEffect(() => {
    let id;
    if (task.running) {
      id = setInterval(() => setTick(t => t + 1), 1000);
    }
    return () => clearInterval(id);
  }, [task.running, task.lastStartTime, task.duration]);

  function toggle() {
    const copy = [...tasks];
    const t = copy[index];
    const now = Date.now();
    if (t.running) {
      // stop
      t.duration = (t.duration || 0) + (now - (t.lastStartTime || now));
      t.running = false;
      t.lastStartTime = null;
    } else {
      // start
      t.running = true;
      t.lastStartTime = now;
    }
    setTasks(copy);
  }

  function remove() {
    const copy = [...tasks];
    copy.splice(index,1);
    setTasks(copy);
  }

  const computed = (task.duration || 0) + (task.running && task.lastStartTime ? Date.now() - task.lastStartTime : 0);

  return (
    <li className="mb-2">
      <div className="flex justify-between items-center">
        <div>
          <div className="font-medium">{task.name}</div>
          <div className="text-sm text-gray-500">Time: {formatDuration(computed)} • {task.date || ''}</div>
        </div>
        <div className="flex gap-2">
          <button onClick={toggle} className="small-btn">{task.running ? 'Stop' : 'Start'}</button>
          <button onClick={remove} className="small-btn">🗑️</button>
        </div>
      </div>
    </li>
  );
}