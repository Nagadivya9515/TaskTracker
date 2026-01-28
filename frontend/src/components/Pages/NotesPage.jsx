import React from 'react';
import NoteTask from '../tasks/NoteTask';
import { useTasks } from '../../context/TasksContext';

export default function NotesPage() {
  const { note } = useTasks();
  const [tasks, setTasks] = note;
  const [content, setContent] = React.useState('');

  function add() {
    if (!content.trim()) return;
    setTasks([...tasks, { content: content.trim(), timestamp: new Date().toLocaleString(), editing: false }]);
    setContent('');
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Notes</h2>
      <div className="mb-4">
        <textarea value={content} onChange={e=>setContent(e.target.value)} className="w-full border px-2 py-1 rounded" rows={3} />
        <div className="flex justify-end mt-2">
          <button className="small-btn bg-blue-500 text-white" onClick={add}>Add Note</button>
        </div>
      </div>
      <ul>
        {tasks.map((t, i) => <NoteTask key={i} task={t} index={i} tasks={tasks} setTasks={setTasks} />)}
      </ul>
    </div>
  );
}