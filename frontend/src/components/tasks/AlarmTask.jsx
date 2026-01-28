import React from 'react';

export default function AlarmTask({ task, index, tasks, setTasks }) {
  function remove() {
    const copy = [...tasks];
    copy.splice(index,1);
    setTasks(copy);
  }
  function snooze() {
    const copy = [...tasks];
    copy[index] = { ...copy[index], nextTime: Date.now() + 5 * 60000 };
    setTasks(copy);
  }

  return (
    <li className="mb-2 flex justify-between items-center">
      <div>
        <div className="font-medium">{task.name}</div>
        <div className="text-xs text-gray-500">Every {task.interval} min</div>
      </div>
      <div className="flex gap-2">
        <button onClick={snooze} className="small-btn">Snooze</button>
        <button onClick={remove} className="small-btn">🗑️</button>
      </div>
    </li>
  );
}

