// import React from 'react';
// import PlannedTask from './tasks/PlannedTask';
// import ChecklistTask from './tasks/ChecklistTask';
// import TimerTask from './tasks/TimerTask';
// import AlarmTask from './tasks/AlarmTask';
// import NoteTask from './tasks/NoteTask';
// import { getTodayDate } from '../utils/format';

// export default function Home({ stores }) {
//   const [planned, setPlanned] = stores.planned;
//   const [checklist, setChecklist] = stores.checklist;
//   const [timers, setTimers] = stores.timer;
//   const [alarms, setAlarms] = stores.alarm;
//   const [notes, setNotes] = stores.note;


//   function addPlanned(name, category, date, time) {
//     if (!name) return;
//     const newTask = {
//       name,
//       category: category || '',
//       date: date || getTodayDate(),
//       time: time || new Date().toLocaleTimeString(),
//       done: false,
//       isEditing: false
//     };
//     setPlanned([...planned, newTask]);
//   }

//   function addChecklist(name) {
//     if (!name) return;
//     setChecklist([...checklist, { name, date: getTodayDate(), done: false, isEditing: false }]);
//   }

//   function addTimer(name) {
//     if (!name) return;
//     setTimers([...timers, { name, duration: 0, running: false, lastStartTime: null, date: getTodayDate() }]);
//   }

//   function addAlarm(name, interval) {
//     if (!name) return;
//     const iv = parseInt(interval, 10) || 1;
//     setAlarms([...alarms, { name, interval: iv, nextTime: Date.now() + iv * 60000 }]);
//   }

//   function addNote(content) {
//     if (!content) return;
//     setNotes([...notes, { content, timestamp: new Date().toLocaleString() }]);
//   }

//   return (
//     <div className="grid md:grid-cols-2 gap-4">
//       <section className="task-card">
//         <h3 className="font-semibold mb-2">Planned</h3>
//         <AddPlanned onAdd={addPlanned} />
//         <ul>
//           {planned.map((t, i) => (
//             <PlannedTask key={i} task={t} index={i} tasks={planned} setTasks={setPlanned} />
//           ))}
//         </ul>
//       </section>

//       <section className="task-card">
//         <h3 className="font-semibold mb-2">Checklist</h3>
//         <AddSimple onAdd={addChecklist} placeholder="Add checklist item" />
//         <ul>
//           {checklist.map((t, i) => (
//             <ChecklistTask key={i} task={t} index={i} tasks={checklist} setTasks={setChecklist} />
//           ))}
//         </ul>
//       </section>

//       <section className="task-card">
//         <h3 className="font-semibold mb-2">Timers</h3>
//         <AddSimple onAdd={addTimer} placeholder="Add timer task" />
//         <ul>
//           {timers.map((t, i) => (
//             <TimerTask key={i} task={t} index={i} tasks={timers} setTasks={setTimers} />
//           ))}
//         </ul>
//       </section>

//       <section className="task-card">
//         <h3 className="font-semibold mb-2">Alarms</h3>
//         <AddAlarm onAdd={addAlarm} />
//         <ul>
//           {alarms.map((t, i) => (
//             <AlarmTask key={i} task={t} index={i} tasks={alarms} setTasks={setAlarms} />
//           ))}
//         </ul>
//       </section>

//       <section className="task-card md:col-span-2">
//         <h3 className="font-semibold mb-2">Notes</h3>
//         <AddSimple onAdd={addNote} placeholder="Write a note" isNote />
//         <ul>
//           {notes.map((t, i) => (
//             <NoteTask key={i} task={t} index={i} tasks={notes} setTasks={setNotes} />
//           ))}
//         </ul>
//       </section>
//     </div>
//   );
// }

// /* small helper components used in Home */
// function AddSimple({ onAdd, placeholder = 'Add...', isNote = false }) {
//   return <InlineAdd onAdd={onAdd} placeholder={placeholder} isNote={isNote} />;
// }

// function AddPlanned({ onAdd }) {
//   return (
//     <div className="flex gap-2 mb-2">
//       <InlineAdd onAdd={(v) => onAdd(v)} placeholder="Task name" />
//       <input type="date" className="border px-2 py-1 rounded" />
//       <input type="time" className="border px-2 py-1 rounded" />
//     </div>
//   );
// }

// function AddAlarm({ onAdd }) {
//   return (
//     <div className="flex gap-2 mb-2 items-center">
//       <InlineAdd onAdd={(v) => onAdd(v, 1)} placeholder="Alarm name" />
//       <input type="number" defaultValue={1} className="w-20 border px-2 py-1 rounded" />
//     </div>
//   );
// }

// function InlineAdd({ onAdd, placeholder, isNote }) {
//   const [val, setVal] = React.useState('');
//   return (
//     <div className="flex gap-2 mb-2">
//       <input
//         value={val}
//         onChange={(e) => setVal(e.target.value)}
//         placeholder={placeholder}
//         className="flex-1 border px-2 py-1 rounded"
//       />
//       <button
//         className="small-btn bg-blue-500 text-white"
//         onClick={() => {
//           if (!val) return;
//           onAdd(val);
//           setVal('');
//         }}
//       >
//         Add
//       </button>
//     </div>
//   );
// }

import PlannedPage from "./Pages/PlannedPage"
import ChecklistPage from "./Pages/ChecklistPage";
import TimerPage from "./Pages/TimerPage";
import AlarmPage from "./Pages/AlarmPage";

export default function HomeDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Section title="Planned Tasks">
        <PlannedPage compact />
      </Section>

      <Section title="Checklist">
        <ChecklistPage compact />
      </Section>

      <Section title="Timer">
        <TimerPage compact />
      </Section>

      <Section title="Alarms">
        <AlarmPage compact />
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="border rounded-lg p-4 bg-white shadow">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {children}
    </div>
  );
}
