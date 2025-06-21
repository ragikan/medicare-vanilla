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

const params = new URLSearchParams(window.location.search);
const patientId = params.get("patientId");

const card = document.getElementById("patient-card");
const testList = document.getElementById("test-list");

database.ref(`customers/${patientId}`).once("value")
  .then(snapshot => {
    const p = snapshot.val();
    if (!p) {
      card.innerHTML = "<p>Patient not found.</p>";
      return;
    }

    // ⬇️ Patient Info
    const infoHTML = `
      <h2>${p.name}</h2>
      <p><strong>Age:</strong> ${p.age}</p>
      <p><strong>Phone:</strong> ${p.phone}</p>
      <p><strong>Collection Type:</strong> ${p.collectionType}</p>
      <p><strong>Address:</strong> ${p.address}</p>
      <p><strong>Appointment:</strong> ${p.appointmentDate} at ${p.appointmentTime}</p>
      <p><strong>Payment Method:</strong> ${p.paymentMethod}</p>
      <p><strong>Payment Status:</strong> ${p.paymentStatus}</p>
    `;
    card.insertAdjacentHTML("afterbegin", infoHTML);

    // ⬇️ Render Tests
    if (p.tests) {
      testList.innerHTML = "";
      Object.entries(p.tests).forEach(([id, test]) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <strong>${test?.name || "Unnamed Test"}</strong> – ₹${test?.price || "N/A"}<br/>
          <em>Sample:</em> ${test?.sample || "N/A"}
        `;
        testList.appendChild(li);
      });
    } else {
      testList.innerHTML = "<li>No tests booked.</li>";
    }

    // ⬇️ Buttons
    const buttonGroup = document.createElement("div");
    buttonGroup.className = "action-buttons";
    buttonGroup.style.marginTop = "30px";
    buttonGroup.style.display = "flex";
    buttonGroup.style.gap = "15px";

    


   // ✅ Accept Button
   // ✅ Accept Button
const acceptBtn = document.createElement("button");
acceptBtn.textContent = "✅ Accept";
acceptBtn.className = "btn accept";
acceptBtn.onclick = () => {
  let modal = document.getElementById("status-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "status-modal";
    modal.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: rgba(0,0,0,0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    `;
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div style="
      background: white;
      padding: 30px;
      border-radius: 10px;
      width: 90%;
      max-width: 400px;
      text-align: center;
      font-family: 'Poppins', sans-serif;
    ">
      <p>Are you sure you want to <strong>accept</strong> this appointment?</p>
      <div style="margin-top: 20px;">
        <button id="status-yes">Yes</button>
        <button id="status-no">No</button>
      </div>
    </div>
  `;

  modal.style.display = "flex";

  document.getElementById("status-yes").onclick = async () => {
    await database.ref(`customers/${patientId}/appointmentStatus`).set("accepted");

    modal.innerHTML = `
      <div style="
        background: white;
        padding: 30px;
        border-radius: 10px;
        width: 90%;
        max-width: 400px;
        text-align: center;
        font-family: 'Poppins', sans-serif;
      ">
        <p><strong>Appointment Accepted</strong></p>
        <p>Please inform <strong>${p.name}</strong> at <strong>${p.phone}</strong>.</p>
        <p>Don't forget to check the “Informed” checkbox after notifying the patient.</p>
        <button id="status-ok">Okay</button>
      </div>
    `;

    document.getElementById("status-ok").onclick = () => {
      modal.style.display = "none";
    };
  };

  document.getElementById("status-no").onclick = () => {
    modal.style.display = "none";
  };
};

// ❌ Reject Button
const rejectBtn = document.createElement("button");
rejectBtn.textContent = "❌ Reject";
rejectBtn.className = "btn reject";
rejectBtn.onclick = () => {
  let modal = document.getElementById("status-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "status-modal";
    modal.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: rgba(0,0,0,0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    `;
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div style="
      background: white;
      padding: 30px;
      border-radius: 10px;
      width: 90%;
      max-width: 400px;
      text-align: center;
      font-family: 'Poppins', sans-serif;
    ">
      <p>Are you sure you want to <strong>reject</strong> this appointment?</p>
      <div style="margin-top: 20px;">
        <button id="status-yes">Yes</button>
        <button id="status-no">No</button>
      </div>
    </div>
  `;

  modal.style.display = "flex";

  document.getElementById("status-yes").onclick = async () => {
    await database.ref(`customers/${patientId}/appointmentStatus`).set("rejected");

    modal.innerHTML = `
      <div style="
        background: white;
        padding: 30px;
        border-radius: 10px;
        width: 90%;
        max-width: 400px;
        text-align: center;
        font-family: 'Poppins', sans-serif;
      ">
        <p><strong>Appointment Rejected</strong></p>
        <p>Please inform <strong>${p.name}</strong> at <strong>${p.phone}</strong>.</p>
        <p>Don't forget to check the “Informed” checkbox after notifying the patient.</p>
        <button id="status-ok">Okay</button>
      </div>
    `;

    document.getElementById("status-ok").onclick = () => {
      modal.style.display = "none";
    };
  };

  document.getElementById("status-no").onclick = () => {
    modal.style.display = "none";
  };
};



// 📆 Reschedule Button
const rescheduleBtn = document.createElement("button");
rescheduleBtn.textContent = "📆 Reschedule";
rescheduleBtn.className = "btn reschedule";

rescheduleBtn.onclick = () => {
  let modal = document.getElementById("reschedule-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "reschedule-modal";
    modal.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: rgba(0,0,0,0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    `;

    modal.innerHTML = `
      <div style="
        background: white;
        padding: 30px;
        border-radius: 10px;
        width: 95%;
        max-width: 500px;
        font-family: 'Poppins', sans-serif;
      ">
        <h3 style="text-align: center;">Reschedule Appointment</h3>
        <p><strong>Choose a new date and time:</strong></p>
        <div style="display: flex; gap: 10px; margin-top: 10px; justify-content: center;">
          <input type="date" id="reschedule-date" style="padding: 8px;" />
          <input type="time" id="reschedule-time" style="padding: 8px;" />
        </div>

        <div style="margin-top: 20px; display: flex; justify-content: center; gap: 15px;">
          <button id="reschedule-confirm">OK</button>
          <button id="toggle-calendar">📅 Show Calendar</button>
          <button id="reschedule-cancel">Cancel</button>
        </div>

        <div id="calendar-section" style="margin-top: 20px; display: none; height: 300px; overflow-y: auto;">
          <iframe src="calendar.html" style="width: 100%; height: 100%; border: 1px solid #ccc; border-radius: 8px;"></iframe>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  modal.style.display = "flex";

  // 🔄 Toggle calendar iframe
  document.getElementById("toggle-calendar").onclick = () => {
    const calendar = document.getElementById("calendar-section");
    calendar.style.display = (calendar.style.display === "none") ? "block" : "none";
  };

  // ❌ Cancel button
  document.getElementById("reschedule-cancel").onclick = () => {
    modal.style.display = "none";
  };

  // ✅ OK button
  document.getElementById("reschedule-confirm").onclick = () => {
    const newDate = document.getElementById("reschedule-date").value;
    const newTime = document.getElementById("reschedule-time").value;

    if (!newDate || !newTime) {
      showModal("Missing Fields", "Please fill both date and time.");
      return;
    }

    // Show confirmation modal
    showModal("Confirm Reschedule", `Are you sure you want to reschedule to ${newDate} at ${newTime}?`, [
      {
        text: "Yes",
        action: async () => {
          await database.ref(`customers/${patientId}/appointmentDate`).set(newDate);
          await database.ref(`customers/${patientId}/appointmentTime`).set(newTime);
          await database.ref(`customers/${patientId}/appointmentStatus`).set("rescheduled");

          // Update UI
          const appointmentPara = Array.from(card.querySelectorAll("p")).find(p => p.textContent.includes("Appointment:"));
          if (appointmentPara) {
            appointmentPara.innerHTML = `<strong>Appointment:</strong> ${newDate} at ${newTime}`;
          }

          // Show final instruction modal
          showModal(
            "✅ Rescheduled",
            `Appointment rescheduled. Kindly inform <strong>${p.name}</strong> at <strong>${p.phone}</strong> and mark the “Informed” checkbox.`,
            [{ text: "Okay", action: () => {} }]
          );

          modal.style.display = "none";
        },
      },
      {
        text: "No",
        action: () => {
          // Just close the modal
        },
      },
    ]);
  };
};

// 🔧 Reusable modal function
function showModal(title, message, buttons = [{ text: "OK", action: () => {} }]) {
  // Remove existing modal if any
  const existing = document.getElementById("popup-modal");
  if (existing) existing.remove();

  const modal = document.createElement("div");
  modal.id = "popup-modal";
  modal.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: rgba(0,0,0,0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99999;
  `;

  const content = `
    <div style="
      background: white;
      padding: 30px;
      border-radius: 10px;
      width: 90%;
      max-width: 400px;
      text-align: center;
      font-family: 'Poppins', sans-serif;
    ">
      <h3>${title}</h3>
      <p style="margin-top: 10px;">${message}</p>
      <div style="margin-top: 20px; display: flex; justify-content: center; gap: 15px;">
        ${buttons
          .map((btn, i) => `<button id="popup-btn-${i}">${btn.text}</button>`)
          .join("")}
      </div>
    </div>
  `;

  modal.innerHTML = content;
  document.body.appendChild(modal);

  // Attach button handlers
  buttons.forEach((btn, i) => {
    document.getElementById(`popup-btn-${i}`).onclick = () => {
      modal.remove();
      btn.action();
    };
  });
}













// ⬇️ Append Buttons to UI
buttonGroup.appendChild(acceptBtn);
buttonGroup.appendChild(rejectBtn);
buttonGroup.appendChild(rescheduleBtn);

card.appendChild(buttonGroup);












  });