const firebaseConfig = {
  apiKey: "AIzaSyAE3pZq_XBsVNmvh5ML-nSLUM8xVTlrrS8",
  authDomain: "medicare-vanilla.firebaseapp.com",
  databaseURL: "https://medicare-vanilla-default-rtdb.firebaseio.com/",
  projectId: "medicare-vanilla",
  storageBucket: "medicare-vanilla.firebasestorage.app",
  messagingSenderId: "595653600625",
  appId: "1:595653600625:web:9799959a6142ebed2582d0"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database(); 
const auth = firebase.auth();

const calendarContainer = document.getElementById("calendar-container");
  const monthSelect = document.getElementById("month-select");
  const yearSelect = document.getElementById("year-select");

  // 🌸 Populate month dropdown
  const now = new Date();
  for (let m = 0; m < 12; m++) {
    const opt = document.createElement("option");
    opt.value = m;
    opt.textContent = new Date(0, m).toLocaleString('default', { month: 'long' });
    if (m === now.getMonth()) opt.selected = true;
    monthSelect.appendChild(opt);
  }

  // 🌸 Populate year dropdown
  for (let y = now.getFullYear(); y <= now.getFullYear() + 3; y++) {
    const opt = document.createElement("option");
    opt.value = y;
    opt.textContent = y;
    if (y === now.getFullYear()) opt.selected = true;
    yearSelect.appendChild(opt);
  }

  // 💡 Update calendar on dropdown change
  monthSelect.addEventListener("change", renderCalendar);
  yearSelect.addEventListener("change", renderCalendar);

  // 🌼 Render calendar
  async function renderCalendar() {
    const month = parseInt(monthSelect.value);
    const year = parseInt(yearSelect.value);

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let calendarHTML = `
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Status</th>
            <th>Patient(s)</th>
          </tr>
        </thead>
        <tbody>
    `;

    const snapshot = await get(child(ref(db), 'customers'));
    const data = snapshot.val() || {};
    const appointments = {};

    for (const id in data) {
      const entry = data[id];
      if (entry.appointmentDate && entry.status === "accepted") {
        const [yyyy, mm, dd] = entry.appointmentDate.split("-").map(Number);
        if (yyyy === year && mm === month + 1) {
          const key = dd;
          if (!appointments[key]) appointments[key] = [];
          appointments[key].push(entry.name);
        }
      }
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const isTaken = appointments[d];
      calendarHTML += `
        <tr>
          <td>${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}</td>
          <td class="${isTaken ? 'taken' : 'available'}">${isTaken ? "Booked" : "Available"}</td>
          <td>${isTaken ? appointments[d].join(", ") : "-"}</td>
        </tr>
      `;
    }

    calendarHTML += `</tbody></table>`;
    calendarContainer.innerHTML = calendarHTML;
  }

  // 🟢 Initial render
  renderCalendar();