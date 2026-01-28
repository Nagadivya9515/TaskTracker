// import React, { use } from "react";
// import {useTasks} from '../../context/TasksContext';
// import { useAuth } from '../../context/AuthContext';
// import { useLoading } from '../../context/LoadingContext';
// import {useState, useEffect} from 'react';
// import axios from 'axios';

// export default function PlannedPage() {

//   const { planned } = useTasks();
//   const [tasks, setTasks] = planned;
//   const {token} = useAuth();
//   const {loading, setLoading} = useLoading();


// async function addTask(taskData) {

//   try {
//     setLoading(true);

//     const response = await axios.post("http://localhost:4000/add-planned-task", 
//       taskData, {
//       headers:
//       {
//         Authorization: `Bearer ${token}`
//       }
//     });

//     // fetchPlannedTasks();
//     setTasks(prev => [...prev, response.data]);
//   } 

//   catch(error) {
//     console.log("Failed to add task", error.message);
//   }
//   finally {
//     setLoading(false);
//   }
// }

// return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">Planned Tasks</h1>
//       <AddPlanned onAdd={addTask} />
//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <ul>
//           {tasks.map(task => (
//             <li key={task.id} className="border-b py-2">
//               <h2 className="font-semibold">{task.name}</h2>
//               <p>Category: {task.category}</p>
//               <p>Date: {new Date(task.date).toLocaleDateString()}</p>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// function AddPlanned({ onAdd }) {
//   const [name, setName] = useState('');
//   const [category, setCategory] = useState('');
//   const [date, setDate] = useState('');
//   const [errors, setErrors] = useState({});
//   const [submitted, setSubmitted] = useState(false);

//   function validate() {

//     const newErrors = {};

//     if(!name.trim()) newErrors.name = "Task name is required";
//     if(!category.trim()) newErrors.category = "Category valid are work, home, others";
//     if(!date.trim()) newErrors.date = "Date is required";
//     setErrors(newErrors);
//     return newErrors;
//   }

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setSubmitted(true);

//     if(!validate) return;
    
//     await onAdd({ name, category, date});
//     setName('');
//     setCategory('');
//     setDate('');
//     setSubmitted(false);
//     setErrors({});

//   }

// return (
//     <div className="mb-4 space-y-2">
//       <input value={name} onChange={e=>setName(e.target.value)} placeholder="Task name" />
//       {errors.name && <p>{errors.name}</p>}

//       <input value={category} onChange={e=>setCategory(e.target.value)} placeholder="Category" />
//       {errors.category && <p>{errors.category}</p>}

//       <input type="date" value={date} onChange={e=>setDate(e.target.value)} />
//       {errors.date && <p>{errors.date}</p>}

//       <button onClick={handleSubmit}>Add Task</button>
//     </div>
//   );

// }

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTasks } from "../../context/TasksContext";
import { useAuth } from "../../context/AuthContext";
import { useLoading } from "../../context/LoadingContext";
import { NavLink } from 'react-router-dom';

export default function PlannedPage( {compact = false} ) {
  // const { planned } = useTasks();
  const [tasks, setTasks] = useState([]);

  const { token } = useAuth();
  const { loading, setLoading } = useLoading();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  const visible = compact ? tasks.slice(0,1) : tasks;


  // 🔹 FETCH planned tasks
  useEffect(() => {
    async function fetchPlanned() {
      try {
        setLoading(true);
        const res = await axios.get(
          "http://localhost:4000/view-planned-tasks",
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
    fetchPlanned();
  }, []);

  // 🔹 ADD planned task
  async function addTask() {
    if (!name || !category || !date) return;
    
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:4000/add-planned-task",
        { name, category, date },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setTasks(prev => [...prev, res.data.task]);
      setName("");
      setCategory("");
      setDate("");

    } catch (err) {
      console.error("Add failed", err.message);
    } finally {
      setLoading(false);
    }
  }

  // 🔹 DELETE planned task
  async function deleteTask(id) {
    try {
      await axios.delete(
        `http://localhost:4000/delete-planned-task/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setTasks(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      console.error("Delete failed", err.message);
    }
  }

  // 🔹 UPDATE planned task
  async function updateTask(id, updatedTask) {
    try {
      const res = await axios.put(
        `http://localhost:4000/update-planned-task/${id}`,
        updatedTask,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setTasks(prev =>
        prev.map(t =>
          t._id === id ? res.data.task : t
        )
      );
    } catch (err) {
      console.error("Update failed", err.message);
    }
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      {!compact && <h1 className="text-2xl font-bold mb-4">Planned Tasks</h1>}

      {/* ADD PLANNED TASK */}
      <div className="space-y-2 mb-6">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Task name"
          className="border px-2 py-1 w-full"
        />

        <input
          value={category}
          onChange={e => setCategory(e.target.value)}
          placeholder="Category (work/home/other)"
          className="border px-2 py-1 w-full"
        />

        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="border px-2 py-1 w-full"
        />

        <button
          onClick={addTask}
          className="bg-blue-500 text-white px-4 py-1 rounded"
        >
          Add Task
        </button>
      </div>

      {/* LIST PLANNED TASKS */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {(visible || []).map(task => {
            return (
              <PlannedRow
                key={task._id}
                task={task}
                onDelete={deleteTask}
                onUpdate={updateTask}
              />
            );
          })}
        </ul>
      )}

      {compact && (
              <NavLink to="/planned" className="text-blue-500 text-sm mt-2 inline-block">
                View all →
              </NavLink>
            )}
    </div>
  );
}

/* ======================================
   INLINE PLANNED TASK ROW (Option B)
====================================== */

function PlannedRow({ task, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(task.name);
  const [category, setCategory] = useState(task.category);
  const [date, setDate] = useState(task.date?.slice(0, 10));

  function saveEdit() {
    onUpdate(task._id, { name, category, date });
    setIsEditing(false);
  }

  return (
    <li className="border-b py-3 space-y-1">
      {isEditing ? (
        <>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            className="border px-2 py-1 w-full"
          />

          <input
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="border px-2 py-1 w-full"
          />

          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="border px-2 py-1 w-full"
          />

          <div className="flex gap-2 mt-2">
            <button
              onClick={saveEdit}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-400 text-white px-3 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className="font-semibold">{task.name}</h2>
          <p>Category: {task.category}</p>
          <p>Date: {new Date(task.date).toLocaleDateString()}</p>

          <div className="flex gap-3 mt-2">
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-500"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(task._id)}
              className="text-red-500"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </li>
  );
}
