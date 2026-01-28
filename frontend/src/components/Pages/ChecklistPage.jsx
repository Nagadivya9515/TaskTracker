// import React from 'react';
// import ChecklistTask from '../tasks/ChecklistTask';
// import { getTodayDate } from '../../utils/format';
// import { useTasks } from '../../context/TasksContext';
// import { useState } from 'react';
// import { useLoading } from '../../context/LoadingContext';

// export default function ChecklistPage() {

//   const { checklist } = useTasks();
//   const [tasks, setTasks] = checklist;
//   const { token } = useAuth();
//   const { setLoading } = useLoading();


//   async function addTask(taskData) {

//     try {

//       setLoading(true);

//       const response = await axios.post("http://localhost:4000/add-checklist-task",
//         taskData, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });

//       const newTask = {
//         task: response.data.task,
//         done: false,
//         order: 0,
//         plannedId
//       }
//       setTasks(prev => [...prev, newTask]);
//     }
//     catch (error) {
//       console.log("Failed to add task", error.message);
//     }
//     finally {
//       setLoading(false);
//     }
//   }

//   // return (
//   //   <div className='p-4'>
//   //     <h1 className="text-2xl font-bold mb-4">Checklist Tasks</h1>
//   //     <div className="flex gap-2 mb-4">
//   //       <input value={text} onChange={e => setText(e.target.value)} className="border px-2 py-1 rounded flex-1" placeholder="New checklist item" />
//   //       <button className="small-btn bg-blue-500 text-white" onClick={add}>Add</button>
//   //     </div>
//   //     <ul>
//   //       {tasks.map((t, i) => <ChecklistTask key={i} task={t} index={i} tasks={tasks} setTasks={setTasks} />)}
//   //     </ul>
//   //   </div>
//   // );

//   return (
//     <div className='p-4'>
//       <h1 className="text-2xl font-bold mb-4">Checklist Tasks</h1>

//       <AddChecklist onAdd = { addTask } />

//       {loading ?(
//         <p>Loading ...</p>
//       ) : (
//            <ul>
//             {tasks.map((task, i) => (
//               <li key={task.id} className='border-b py-2'>
//                 <h2 className='font-semibold'>{task.task}</h2>
//                 <input type="checkbox" checked={task.done} onChange={() => toggleDone(task._id)} />
//                 <p>Date: {new Date(task.date).toLocaleDateString()}</p>
//               </li>
//             ))}
//            </ul>
//       )}
//     </div>
//   )
// }

// function AddChecklist({ onAdd }) {

//   const [task, setTask] = useState('');
//   const [date, setDate] = useState('');
//   const [done, setDone] = useState(false);


// }

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useLoading } from "../../context/LoadingContext";
import { Link } from 'react-router-dom';

export default function ChecklistPage( compact = false ) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const { token } = useAuth();
  const { loading, setLoading } = useLoading();

  const visible = compact ? tasks.slice(0,3) : tasks;

  // 🔹 Fetch checklist on load
  useEffect(() => {
    async function fetchChecklist() {
      try {
        setLoading(true);
        const res = await axios.get(
          "http://localhost:4000/view-checklist-items",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setTasks(res.data.tasks);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchChecklist();
  }, []);

  // 🔹 Add checklist item
  async function addChecklist() {
    if (!newTask.trim()) return;

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:4000/add-checklist-task",
        { task: newTask, plannedTaskId: selectedPlannedTaskId },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setTasks(prev => [...prev, res.data.checklistItem]);
      setNewTask("");
    } catch (err) {
      console.error("Add failed", err.message);
    } finally {
      setLoading(false);
    }
  }

  // 🔹 Toggle checkbox
  async function toggleDone(id) {
    try {
      const res = await axios.patch(
        `http://localhost:4000/toggle-checklist-task/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setTasks(prev =>
        prev.map(t => (t._id === id ? res.data.item : t))
      );
    } catch (err) {
      console.error("Toggle failed", err.message);
    }
  }

  // 🔹 Delete checklist item
  async function deleteTask(id) {
    try {
      await axios.delete(
        `http://localhost:4000/delete-checklist-item/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setTasks(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      console.error("Delete failed", err.message);
    }
  }

  // 🔹 Update checklist text
  async function updateTask(id, updatedText) {
    try {
      const res = await axios.put(
        `http://localhost:4000/update-checklist-item/${id}`,
        { task: updatedText },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setTasks(prev =>
        prev.map(t =>
          t._id === id ? res.data.checklistItem : t
        )
      );
    } catch (err) {
      console.error("Update failed", err.message);
    }
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      { !compact && <h1 className="text-2xl font-bold mb-4">Checklist Tasks</h1> }

      {/* Add Checklist */}
      <div className="flex gap-2 mb-4">
        <input
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          placeholder="New checklist item"
          className="border px-2 py-1 flex-1 rounded"
        />
        <button
          onClick={addChecklist}
          className="bg-blue-500 text-white px-4 rounded"
        >
          Add
        </button>
      </div>

      {/* Checklist Items */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {visible.map(task => {
            return (
              <ChecklistRow
                key={task._id}
                task={task}
                onToggle={toggleDone}
                onDelete={deleteTask}
                onUpdate={updateTask}
              />
            );
          })}
        </ul>
      )}

      {compact && (
        <Link to="/checklist" className="text-blue-500 text-sm mt-2 inline-block">
          View all →
        </Link>
      )}
    </div>
  );
}

/* ======================================
   INLINE CHECKLIST ROW (Option B)
====================================== */

function ChecklistRow({ task, onToggle, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(task.task);

  function saveEdit() {
    if (!text.trim()) return;
    onUpdate(task._id, text);
    setIsEditing(false);
  }

  return (
    <li className="flex items-center gap-2 py-2 border-b">
      <input
        type="checkbox"
        checked={task.done}
        onChange={() => onToggle(task._id)}
      />

      {isEditing ? (
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onBlur={saveEdit}
          onKeyDown={e => e.key === "Enter" && saveEdit()}
          className="border px-1 flex-1"
          autoFocus
        />
      ) : (
        <span
          className={`flex-1 cursor-pointer ${task.done ? "line-through text-gray-500" : ""
            }`}
          onDoubleClick={() => setIsEditing(true)}
        >
          {task.task}
        </span>
      )}

      <button
        onClick={() => setIsEditing(true)}
        className="text-blue-500 text-sm"
      >
        Edit
      </button>
      <button
        onClick={() => onDelete(task._id)}
        className="text-red-500 text-sm"
      >
        Delete
      </button>
    </li>
  );
}
