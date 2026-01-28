import React from 'react';
import escapeHtml from '../../utils/escapeHtml';

export default function PlannedTask({ task, index, tasks, setTasks }) {
  function toggleDone() {
    const copy = [...tasks];
    copy[index].done = !copy[index].done;
    setTasks(copy);
  }
  function remove() {
    const copy = [...tasks];
    copy.splice(index,1);
    setTasks(copy);
  }
  function startEdit() {
    const copy = [...tasks];
    copy[index].isEditing = true;
    setTasks(copy);
  }
  function save() {
    const nameEl = document.getElementById(`edit-name-${index}`);
    const dateEl = document.getElementById(`edit-date-${index}`);
    const timeEl = document.getElementById(`edit-time-${index}`);
    const name = nameEl?.value.trim();
    const date = dateEl?.value;
    const time = timeEl?.value;
    if (!name || !date) {
      alert('Task name and date required');
      return;
    }
    const copy = [...tasks];
    copy[index] = { ...copy[index], name, date, time, isEditing: false };
    setTasks(copy);
  }
  function cancel() {
    const copy = [...tasks];
    copy[index].isEditing = false;
    setTasks(copy);
  }

  if (task.isEditing) {
    return (
      <li className="mb-2">
        <div className="flex gap-2 items-center">
          <input id={`edit-name-${index}`} defaultValue={task.name} className="border px-2 py-1 rounded flex-1" />
          <input id={`edit-date-${index}`} type="date" defaultValue={task.date || ''} className="border px-2 py-1 rounded" />
          <input id={`edit-time-${index}`} type="time" defaultValue={task.time || ''} className="border px-2 py-1 rounded" />
          <button onClick={save} className="small-btn bg-green-500 text-white">💾 Save</button>
          <button onClick={cancel} className="small-btn">Cancel</button>
        </div>
      </li>
    );
  }

  return (
    <li className="mb-2 flex justify-between items-center">
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={!!task.done} onChange={toggleDone} />
        <div>
          <div dangerouslySetInnerHTML={{ __html: escapeHtml(task.name) }} />
          <div className="text-xs text-gray-500">
            <span>{task.category ? `Category: ${escapeHtml(task.category)} • ` : ''}</span>
            <span>{task.date || ''} {task.time ? `(${task.time})` : ''}</span>
          </div>
        </div>
      </label>
      <div className="flex gap-2">
        <button onClick={startEdit} className="small-btn">✏️</button>
        <button onClick={remove} className="small-btn">🗑️</button>
      </div>
    </li>
  );
}