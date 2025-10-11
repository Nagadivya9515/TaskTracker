let plannedTasks = JSON.parse(localStorage.getItem("plannedTasks")) || [];
let checklistTasks = JSON.parse(localStorage.getItem("checklistTasks")) || [];
let timerTasks = JSON.parse(localStorage.getItem("timerTasks")) || [];
let alarmTasks = JSON.parse(localStorage.getItem("alarmTasks")) || [];
let notes = JSON.parse(localStorage.getItem("notes")) || [];

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

function deleteTask(taskArray, index, storageKey, renderFunction) {
  taskArray.splice(index, 1);
  localStorage.setItem(storageKey, JSON.stringify(taskArray));
  renderFunction();
}

function addPlannedTask() {
  const input = document.getElementById("plannedInput");
  const category = document.getElementById("plannedCategory").value;
  const date = document.getElementById("plannedDate").value || getTodayDate();
  const time =
    document.getElementById("plannedTime").value ||
    new Date().toLocaleTimeString();

  const name = input.value.trim();
  if (!name) return;

  plannedTasks.push({ name, time, date, category });
  localStorage.setItem("plannedTasks", JSON.stringify(plannedTasks));
  input.value = "";
  renderPlannedTasks();
}

function renderPlannedTasks() {
  const plannedList = document.getElementById("plannedList");
  plannedList.innerHTML = "";
  plannedTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${task.name}</strong>
                        <span class="badge ${task.category}">${task.category}</span>
                        <div class="time">Time: ${task.time}</div>
                        <div class="date">Date: ${task.date}</div>
                        <button onclick="deleteTask(plannedTasks, ${index}, 'plannedTasks', renderPlannedTasks)">🗑️</button>`;
    plannedList.appendChild(li);
  });
}

function addChecklistTask() {
  const input = document.getElementById("checklistInput");
  const date = document.getElementById("checklistDate").value || getTodayDate();
  const name = input.value.trim();
  if (!name) return;
  checklistTasks.push({ name, done: false, date });
  localStorage.setItem("checklistTasks", JSON.stringify(checklistTasks));
  input.value = "";
  renderChecklistTasks();
}

function toggleChecklist(index) {
  checklistTasks[index].done = !checklistTasks[index].done;
  localStorage.setItem("checklistTasks", JSON.stringify(checklistTasks));
  renderChecklistTasks();
}

function renderChecklistTasks() {
  const list = document.getElementById("checklistList");
  list.innerHTML = "";
  checklistTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.innerHTML = `<input type="checkbox" ${
      task.done ? "checked" : ""
    } onchange="toggleChecklist(${index})">
                        <span class="${task.done ? "completed" : ""}">${
      task.name
    }</span>
                        <div class="date">Date: ${task.date}</div>
                        <button onclick="deleteTask(checklistTasks, ${index}, 'checklistTasks', renderChecklistTasks)">🗑️</button>`;
    list.appendChild(li);
  });
}

function addTimerTask() {
  const input = document.getElementById("timerInput");
  const date = document.getElementById("timerDate").value || getTodayDate();
  const name = input.value.trim();
  if (!name) return;
  timerTasks.push({
    name,
    duration: 0,
    running: false,
    lastStartTime: null,
    date,
  });
  localStorage.setItem("timerTasks", JSON.stringify(timerTasks));
  input.value = "";
  renderTimerTasks();
}

function toggleTimer(index) {
  const task = timerTasks[index];
  const now = Date.now();
  if (task.running) {
    task.duration += Math.floor((now - task.lastStartTime) / 1000);
    task.running = false;
    task.lastStartTime = null;
  } else {
    task.running = true;
    task.lastStartTime = now;
  }
  localStorage.setItem("timerTasks", JSON.stringify(timerTasks));
  renderTimerTasks();
}

function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

function renderTimerTasks() {
  const list = document.getElementById("timerList");
  list.innerHTML = "";
  timerTasks.forEach((task, index) => {
    let duration = task.duration;
    if (task.running && task.lastStartTime) {
      duration += Math.floor((Date.now() - task.lastStartTime) / 1000);
    }
    const li = document.createElement("li");
    li.innerHTML = `<strong>${task.name}</strong>
                        <div class="time">Time: ${formatDuration(
                          duration
                        )}</div>
                        <div class="date">Date: ${task.date}</div>
                        <button onclick="toggleTimer(${index})">${
      task.running ? "Stop" : "Start"
    }</button>
                        <button onclick="deleteTask(timerTasks, ${index}, 'timerTasks', renderTimerTasks)">🗑️</button>`;
    list.appendChild(li);
  });
}

function addAlarmTask() {
  const name = document.getElementById("alarmInput").value.trim();
  const interval = parseInt(
    document.getElementById("alarmInterval").value.trim()
  );
  if (!name || isNaN(interval)) return;
  alarmTasks.push({ name, interval, nextTime: Date.now() + interval * 60000 });
  localStorage.setItem("alarmTasks", JSON.stringify(alarmTasks));
  renderAlarmTasks();
}

function renderAlarmTasks() {
  const list = document.getElementById("alarmList");
  list.innerHTML = "";
  alarmTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${task.name}</strong> (Every ${task.interval} mins)
                        <button onclick="deleteTask(alarmTasks, ${index}, 'alarmTasks', renderAlarmTasks)">🗑️</button>
                        <button onclick="snoozeAlarm(${index})">Snooze</button>`;
    list.appendChild(li);
  });
}

function snoozeAlarm(index) {
  alarmTasks[index].nextTime = Date.now() + 5 * 60000;
  localStorage.setItem("alarmTasks", JSON.stringify(alarmTasks));
}

function checkAlarms() {
  const now = Date.now();
  const sound = document.getElementById("alarmSound");
  alarmTasks.forEach((task) => {
    if (now >= task.nextTime) {
      sound.play();
      task.nextTime = now + task.interval * 60000;
    }
  });
  localStorage.setItem("alarmTasks", JSON.stringify(alarmTasks));
}

function formatNoteText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\.\./g, "•");
}

function addNote() {
  const input = document.getElementById("noteInput");
  const content = input.value.trim();
  if (!content) return;
  const timestamp = new Date().toLocaleString();
  notes.push({ content, timestamp });
  localStorage.setItem("notes", JSON.stringify(notes));
  input.value = "";
  renderNotes();
}

function renderNotes() {
  const list = document.getElementById("noteList");
  list.innerHTML = "";
  notes.forEach((note, index) => {
    const li = document.createElement("li");
    li.className = "note";

    // Check if the note is in edit mode
    if (note.editing) {
      li.innerHTML = `
        <textarea id="editNote${index}">${note.content}</textarea>
        <br>
        <button onclick="saveNoteEdit(${index})">💾 Save</button>
        <button onclick="cancelNoteEdit(${index})">❌ Cancel</button>
      `;
    } else {
      li.innerHTML = `<div class="note-content">${formatNoteText(
        note.content
      )}</div>
                <time>${note.timestamp}</time>
                <button onclick="deleteNote(${index})">🗑️</button>
                <button onclick="editNote(${index})">✏️ Edit</button>`;
    }

    list.appendChild(li);
  });
}

const deletedNotesStack = [];

function deleteNote(index) {
  const noteList = document.getElementById("noteList");
  const noteItems = noteList.getElementsByTagName("li");

  if (noteItems[index]) {
    const deletedContent = noteItems[index].innerHTML;
    deletedNotesStack.push({ content: deletedContent, index });
    noteItems[index].remove();
    notes.splice(index, 1);
    localStorage.setItem("notes", JSON.stringify(notes));

    showUndoMessage();
  }
}

function undoDelete() {
  if (deletedNotesStack.length === 0) return;

  const lastDeleted = deletedNotesStack.pop();
  const restoredNote = {
    content: lastDeleted.content,
    timestamp: new Date().toLocaleString(),
  };
  notes.splice(lastDeleted.index, 0, restoredNote);
  localStorage.setItem("notes", JSON.stringify(notes));
  renderNotes();

  if (deletedNotesStack.length === 0) hideUndoMessage();
}

function showUndoMessage() {
  const undoDiv = document.getElementById("undoMessage");
  undoDiv.innerHTML = `Note deleted. <button onclick="undoDelete()">Undo</button>`;
  undoDiv.style.display = "block";
}

function hideUndoMessage() {
  const undoDiv = document.getElementById("undoMessage");
  undoDiv.innerHTML = "";
  undoDiv.style.display = "none";
}

function editNote(index) {
  notes[index].editing = true;
  renderNotes();
}

function cancelNoteEdit(index) {
  delete notes[index].editing;
  renderNotes();
}

function saveNoteEdit(index) {
  const textarea = document.getElementById(`editNote${index}`);
  const newText = textarea.value.trim();
  if (!newText) return;
  notes[index].content = newText;
  delete notes[index].editing;
  localStorage.setItem("notes", JSON.stringify(notes));
  renderNotes();
}

function exportNotes() {
  const content = notes
    .map((n) => `--- ${n.timestamp} ---\n${n.content}`)
    .join("\n\n");
  const blob = new Blob([content], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "notes.txt";
  a.click();
}

function exportPlans() {
  const content = plannedTasks
    .map((n) => `${n.name} | ${n.category} | ${n.date} | ${n.time}`)
    .join("\n\n");
  const blob = new Blob([content], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "plans.txt";
  a.click();
}


renderNotes();
renderPlannedTasks();
renderChecklistTasks();
renderTimerTasks();
renderAlarmTasks();
setInterval(renderTimerTasks, 1000);
setInterval(checkAlarms, 60000);
