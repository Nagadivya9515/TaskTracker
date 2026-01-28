import React from 'react';
import { formatNoteText } from '../../utils/format';

export default function NoteTask({ task, index, tasks, setTasks }) {
  function startEdit() {
    const copy = [...tasks];
    copy[index].editing = true;
    setTasks(copy);
  }
  function cancelEdit() {
    const copy = [...tasks];
    copy[index].editing = false;
    setTasks(copy);
  }
  function save() {
    const el = document.getElementById(`etask${index}`);
    const val = el?.value.trim();
    if (!val) { alert('Note content cannot be empty!'); return; }
    const copy = [...tasks];
    copy[index] = { ...copy[index], content: val, editing: false };
    setTasks(copy);
  }
  function remove() {
    const copy = [...tasks];
    copy.splice(index,1);
    setTasks(copy);
  }

  if (task.editing) {
    return (
      <li className="mb-2">
        <textarea id={`etask${index}`} defaultValue={task.content} className="w-full border px-2 py-1 rounded"></textarea>
        <div className="flex gap-2 mt-1">
          <button onClick={save} className="small-btn bg-green-500 text-white">💾 Save</button>
          <button onClick={cancelEdit} className="small-btn">❌ Cancel</button>
        </div>
      </li>
    );
  }

  return (
    <li className="mb-3">
      <div dangerouslySetInnerHTML={{ __html: formatNoteText(task.content) }} />
      <div className="text-xs text-gray-500">{task.timestamp}</div>
      <div className="flex gap-2 mt-1">
        <button onClick={() => { startEdit(); }} className="small-btn">✏️ Edit</button>
        <button onClick={remove} className="small-btn">🗑️</button>
      </div>
    </li>
  );
}