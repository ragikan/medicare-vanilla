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

const tableBody = document.querySelector("#patients-table tbody");
const detailsCard = document.getElementById("patient-details-card");
const overlay = document.getElementById("overlay");

// 👇 Load & display all patients
database.ref("customers").once("value")
  .then(snapshot => {
    snapshot.forEach(child => {
      const data = child.val();
      const key = child.key;

      const name = data.name || "Unknown";
      const appointmentTime = `${data.appointmentDate || "N/A"} ${data.appointmentTime || ""}`;

      let tests = "No tests recorded";
      if (data.tests && typeof data.tests === 'object') {
        const testNames = Object.values(data.tests).map(t => t.name);
        if (testNames.length > 0) {
          tests = testNames.join(", ");
        }
      }

      const status = data.status || "pending";

      const row = document.createElement("tr");
      row.setAttribute("data-id", key);
      row.classList.add(`status-${status}`);

      row.innerHTML = `
        <td>${name}</td>
        <td>${tests}</td>
        <td>${appointmentTime}</td>
        <td><button class="view-btn" data-id="${key}">View Details</button></td>
      `;

      tableBody.appendChild(row);
    });

    document.querySelectorAll(".view-btn").forEach(button => {
      button.addEventListener("click", () => {
        const patientId = button.dataset.id;
        showPatientDetails(patientId);
      });
    });
  })
  .catch(error => {
    console.error("Error fetching patients:", error);
    tableBody.innerHTML = `<tr><td colspan="4">Failed to load data.</td></tr>`;
  });

// 👇 Show floating details card
function showPatientDetails(id) {
  database.ref(`customers/${id}`).once("value")
    .then(snapshot => {
      const data = snapshot.val();
      if (!data) return alert("No data found for this patient.");

      const {
        name, age, phone, collectionType, address,
        appointmentDate, appointmentTime,
        paymentMethod, paymentStatus, tests
      } = data;

      const testList = tests
        ? Object.values(tests).map(t => `<li>${t.name}</li>`).join("")
        : "<li>No tests recorded</li>";

      detailsCard.innerHTML = `
        <button class="close-btn" onclick="closeDetailsCard()">❌</button>
        <h3>Patient Details</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Age:</strong> ${age}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Collection:</strong> ${collectionType} (${address})</p>
        <p><strong>Appointment:</strong> ${appointmentDate} at ${appointmentTime}</p>
        <p><strong>Payment:</strong> ${paymentMethod} (${paymentStatus || "pending"})</p>
        <p><strong>Tests:</strong></p>
        <ul>${testList}</ul>
        <div style="margin-top: 10px;">
          <button onclick="acceptPatient('${id}')">✅ Accept</button>
          <button onclick="reschedulePatient('${id}')">🔁 Reschedule</button>
          <button style="color: red;" onclick="deletePatient('${id}')">❌ Delete</button>
        </div>
      `;

      overlay.style.display = "block";
      detailsCard.style.display = "block";
    })
    .catch(error => {
      alert("Error fetching details: " + error.message);
    });
}

// 👇 Hide the card and blur overlay
function closeDetailsCard() {
  detailsCard.style.display = "none";
  overlay.style.display = "none";
}

async function checkTimeConflict(date, time, excludeId = null) {
  const snapshot = await database.ref("customers").once("value");
  let conflictName = null;
  snapshot.forEach(child => {
    const data = child.val();
    if (
      data.status === "accepted" &&
      data.appointmentDate === date &&
      data.appointmentTime === time &&
      child.key !== excludeId
    ) {
      conflictName = data.name;
    }
  });
  return conflictName;
}

async function suggestAlternateSlots(date, time, excludeId = null) {
  const allSnap = await database.ref("customers").once("value");
  const bookedTimes = new Set();
  allSnap.forEach(child => {
    const data = child.val();
    if (
      data.status === "accepted" &&
      data.appointmentDate === date &&
      child.key !== excludeId
    ) {
      bookedTimes.add(data.appointmentTime);
    }
  });

  const formatTime = (h, m) => `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  const [hourStr, minuteStr] = time.split(":"), hour = parseInt(hourStr), minute = parseInt(minuteStr);
  const slots = [], tried = new Set();

  for (let offset = -30; offset <= 60; offset += 15) {
    if (offset === 0) continue;
    let newMin = minute + offset;
    let newHr = hour;
    if (newMin < 0) { newHr -= 1; newMin = 60 + newMin; }
    else if (newMin >= 60) { newHr += Math.floor(newMin / 60); newMin %= 60; }
    if (newHr < 0 || newHr >= 24) continue;
    const newTime = formatTime(newHr, newMin);
    if (!bookedTimes.has(newTime) && !tried.has(newTime)) {
      slots.push(newTime);
      tried.add(newTime);
    }
    if (slots.length >= 3) break;
  }
  return slots;
}

// 👇 Accept patient (update status to accepted)
async function acceptPatient(id) {
  const snapshot = await database.ref(`customers/${id}`).once("value");
  const current = snapshot.val();
  const { appointmentDate, appointmentTime } = current;

  const conflict = await checkTimeConflict(appointmentDate, appointmentTime, id);
  if (conflict) {
    const suggestions = await suggestAlternateSlots(appointmentDate, appointmentTime, id);
    const suggestionText = suggestions.length > 0 ? `Available slots: ${suggestions.join(" | ")}` : "No nearby slots found.";
    const proceed = confirm(`⚠️ Slot already taken by ${conflict}. ${suggestionText}\nStill accept this time?`);
    if (!proceed) return;
  }

  await database.ref(`customers/${id}`).update({ status: "accepted" });
  updateRowStatus(id, "accepted");
  alert("Appointment accepted ✅");
  closeDetailsCard();
}

// 👇 Cancel patient (update status to cancelled)
function deletePatient(id) {
  database.ref(`customers/${id}`).update({ status: "cancelled" })
    .then(() => {
      updateRowStatus(id, "cancelled");
      alert("Appointment cancelled ❌");
      closeDetailsCard();
    })
    .catch(error => alert("Error cancelling: " + error.message));
}

// 👇 Placeholder for rescheduling
async function reschedulePatient(id) {
  const newTime = prompt("Enter new time (HH:MM):");
  const snapshot = await database.ref(`customers/${id}`).once("value");
  const data = snapshot.val();

  if (!newTime) return;
  const conflict = await checkTimeConflict(data.appointmentDate, newTime, id);
  if (conflict) {
    const suggestions = await suggestAlternateSlots(data.appointmentDate, newTime, id);
    const suggestionText = suggestions.length > 0 ? `Available: ${suggestions.join(" | ")}` : "No suggestions.";
    const proceed = confirm(`❗ Time clash with ${conflict}. ${suggestionText}\nStill reschedule?`);
    if (!proceed) return;
  }

  await database.ref(`customers/${id}`).update({ appointmentTime: newTime });
  alert("Rescheduled to " + newTime);
  closeDetailsCard();
}

// 👇 Update row color based on status
function updateRowStatus(id, status) {
  const row = document.querySelector(`[data-id="${id}"]`);
  if (row) {
    row.classList.remove("status-accepted", "status-cancelled", "status-pending");
    row.classList.add(`status-${status}`);
  }
}

function openCalendar() {
  document.getElementById("calendar-popup").style.display = "block";
}

function closeCalendar() {
  document.getElementById("calendar-popup").style.display = "none";
}