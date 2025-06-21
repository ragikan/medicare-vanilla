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

//write code here for reject accept and reschedule button

window.initializeRejectButton =  function initializeRejectButton(rejectBtn, patientData, patientId) {
  // 🔧 Create modal if it doesn’t exist
  let modal = document.getElementById("reject-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "reject-modal";
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
        width: 90%;
        max-width: 400px;
        text-align: center;
        font-family: 'Poppins', sans-serif;
      " id="reject-content">
        <p id="reject-message">Are you sure you want to reject the appointment?</p>
        <div id="reject-buttons" style="margin-top: 20px;">
          <button id="reject-yes">Yes</button>
          <button id="reject-no">No</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }

  const message = document.getElementById("reject-message");
  const buttons = document.getElementById("reject-buttons");

  const yesBtn = modal.querySelector("#reject-yes");
  const noBtn = modal.querySelector("#reject-no");

  // Show modal when reject button is clicked
  rejectBtn.addEventListener("click", () => {
    modal.style.display = "flex";

    // Reset to initial state
    message.innerHTML = "Are you sure you want to reject the appointment?";
    buttons.innerHTML = `
      <button id="reject-yes">Yes</button>
      <button id="reject-no">No</button>
    `;

    // Reassign event listeners after resetting
    modal.querySelector("#reject-yes").addEventListener("click", async () => {
      // ✅ Update database
      await firebase.database().ref(`customers/${patientId}/appointmentStatus`).set("rejected");

      // 👁️ Update modal content
      message.innerHTML = `
        <p><strong>Appointment Rejected</strong></p>
        <p>Please inform <strong>${patientData.name}</strong> at <strong>${patientData.phone}</strong>.</p>
        <p>Don't forget to check the “Informed” checkbox after notifying the patient.</p>
      `;

      buttons.innerHTML = `<button id="reject-ok">Okay</button>`;

      modal.querySelector("#reject-ok").addEventListener("click", () => {
        modal.style.display = "none";
      });
    });

    modal.querySelector("#reject-no").addEventListener("click", () => {
      modal.style.display = "none";
    });
  });
}
