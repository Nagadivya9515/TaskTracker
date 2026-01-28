import React from 'react';
import TimerTask from '../tasks/TimerTask';
import { getTodayDate } from '../../utils/format';
import { useTasks } from '../../context/TasksContext';
import {Link} from 'react-router-dom';
export default function TimerPage( compact = false ) {
  const {timer} = useTasks();
  const [tasks, setTasks] = timer;
  const [name, setName] = React.useState('');

  const visible = compact ? tasks.slice(0,3) : tasks;
  function add() {
    if (!name.trim()) return;
    setTasks([...tasks, { name: name.trim(), duration: 0, running: false, lastStartTime: null, date: getTodayDate() }]);
    setName('');
  }

  return (
    <div>
      {!compact && <h2 className="text-xl font-semibold mb-3">Timers</h2>}
      <div className="flex gap-2 mb-4">
        <input value={name} onChange={e=>setName(e.target.value)} className="border px-2 py-1 rounded flex-1" placeholder="Timer name" />
        <button className="small-btn bg-blue-500 text-white" onClick={add}>Add</button>
      </div>
      <ul>
        {visible.map((t, i) => <TimerTask key={i} task={t} index={i} tasks={tasks} setTasks={setTasks} />)}
      </ul>

      {compact && (
        <Link to="/checklist" className="text-blue-500 text-sm mt-2 inline-block">
          View all →
        </Link>
      )}
    </div>
  );
}