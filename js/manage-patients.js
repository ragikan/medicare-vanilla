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

function openCalendar() {
  document.getElementById("calendar-popup").style.display = "block";
}

function closeCalendar() {
  document.getElementById("calendar-popup").style.display = "none";
}


const tableBody = document.getElementById("patients-tbody");

database.ref("customers").once("value")
  .then(snapshot => {
    const customers = snapshot.val();

    if (!customers) {
      tableBody.innerHTML = "<tr><td colspan='6'>No patient bookings yet.</td></tr>";
      return;
    }

    Object.entries(customers).reverse().forEach(([id, patient]) => {
      const row = document.createElement("tr");
      row.className = "unread"; // default state

      const bookingTime = new Date(patient.timestamp).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short"
      });

      row.innerHTML = `
        <td>${patient.name}</td>
        <td>${bookingTime}</td>
        <td>${patient.paymentStatus}</td>
        <td><input type="checkbox" data-id="${id}" class="informed-checkbox"></td>
        <td><span class="unread-badge">Unread</span></td>
        <td><button class="view-btn" data-id="${id}">🔍 View</button></td>
      `;

      tableBody.appendChild(row);

      const viewBtn = row.querySelector(".view-btn");
      const badge = row.querySelector(".unread-badge");

      viewBtn.addEventListener("click", () => {
  row.classList.remove("unread");
  row.classList.add("read");
  badge.remove();

  const frame = document.getElementById("patient-frame");
  frame.src = `view-patient.html?patientId=${id}`;
  document.getElementById("view-patient-popup").style.display = "block";
});

       const frame = document.getElementById("patient-frame");
  frame.src = `view-patient.html?patientId=${id}`;
  document.getElementById("view-patient-popup").style.display = "block";
    });
  })
  .catch(error => {
    console.error("Error loading patient data:", error);
    tableBody.innerHTML = "<tr><td colspan='6'>Failed to load data.</td></tr>";
  });



   function closePatientPopup() {
  document.getElementById("view-patient-popup").style.display = "none";
  document.getElementById("patient-frame").src = ""; // Clear iframe
}













  