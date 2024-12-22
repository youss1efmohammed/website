const taskForm = document.getElementById("task-form");
const scheduleBody = document.getElementById("schedule-body");
let tasks = []; 

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const taskName = document.getElementById("task-name").value;
  const taskDate = document.getElementById("task-date").value;
  const taskStart = document.getElementById("task-start").value;
  const taskDuration = parseInt(document.getElementById("task-duration").value);
  const taskPriority = document.getElementById("task-priority").value;

  const startHour = parseInt(taskStart.split(":")[0]);
  const startMinute = parseInt(taskStart.split(":")[1]);
  const endHour = startHour + taskDuration;
  const endMinute = startMinute;

  const formatTime = (hour, minute) => {
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute < 10 ? "0" + minute : minute} ${period}`;
  };

  const startFormatted = formatTime(startHour, startMinute);
  const endFormatted = formatTime(endHour, endMinute);

  tasks.push({
    name: taskName,
    date: taskDate,
    start: startFormatted,
    end: endFormatted,
    priority: taskPriority,
    done: false,
  });

  renderSchedule();
  taskForm.reset();
});

function renderSchedule() {
  scheduleBody.innerHTML = "";

  tasks.forEach((task, index) => {
    const row = document.createElement("tr");
    row.className = task.priority === "important" ? "important-task" : "";
    if (task.done) row.classList.add("line-through");

    row.innerHTML = `
            <td class="p-4 task-time">${task.start} - ${task.end}</td>
            <td class="p-4">${task.name}</td>
            <td class="p-4">${
              task.priority === "important" ? "Important" : "Normal"
            }</td>
            <td class="p-4">
                <button class="btn bg-green-500 hover:bg-green-600" onclick="markDone(${index})">Done</button>
                <button class="btn bg-red-500 hover:bg-red-600" onclick="deleteTask(${index})">Delete</button>
            </td>
        `;

    scheduleBody.appendChild(row);
  });
}

function markDone(index) {
  tasks[index].done = true;
  renderSchedule();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  renderSchedule();
}

document.getElementById("save-pdf").addEventListener("click", async () => {
  const scheduleContainer = document.getElementById("schedule-container");
  const canvas = await html2canvas(scheduleContainer);
  const imgData = canvas.toDataURL("image/png");

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();
  const imgWidth = 190;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
  pdf.save("schedule.pdf");
});
