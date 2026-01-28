import React from 'react';

export default function ChecklistTask({ task, index, tasks, setTasks }) {
  function toggle() {
    const copy = [...tasks];
    copy[index].done = !copy[index].done;
    setTasks(copy);
  }
  function startEdit() {
    const copy = [...tasks];
    copy[index].isEditing = true;
    setTasks(copy);
  }
  function save() {
    const el = document.getElementById(`edit-text-${index}`);
    const val = el?.value.trim();
    const dateEl = document.getElementById(`edit-date-${index}`);
    const dateVal = dateEl?.value;
    if (!val || !dateVal) { alert('Text and date required'); return; }
    const copy = [...tasks];
    copy[index] = { ...copy[index], name: val, date: dateVal, isEditing: false };
    setTasks(copy);
  }
  function cancel() {
    const copy = [...tasks];
    copy[index].isEditing = false;
    setTasks(copy);
  }
  function remove() {
    const copy = [...tasks];
    copy.splice(index,1);
    setTasks(copy);
  }

  if (task.isEditing) {
    return (
      <li className="mb-2">
        <input id={`edit-text-${index}`} defaultValue={task.name} className="border px-2 py-1 rounded w-2/3" />
        <input id={`edit-date-${index}`} type="date" defaultValue={task.date || ''} className="border px-2 py-1 rounded ml-2" />
        <button onClick={save} className="small-btn bg-green-500 text-white ml-2">💾</button>
        <button onClick={cancel} className="small-btn ml-1">Cancel</button>
      </li>
    );
  }

  return (
    <li className="mb-2 flex justify-between items-center">
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={!!task.done} onChange={toggle} />
        <span>{task.name}</span>
      </label>
      <div className="flex gap-2">
        <button onClick={startEdit} className="small-btn">✏️</button>
        <button onClick={remove} className="small-btn">🗑️</button>
      </div>
    </li>
  );
}