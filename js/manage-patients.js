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

// Get table body element
const tableBody = document.getElementById("patients-tbody");
const searchInput = document.getElementById("search-input");
const statusFilter = document.getElementById("status-filter");
const paymentFilter = document.getElementById("payment-filter");

function loadPatients() {
  database.ref("customers").once("value")
    .then(snapshot => {
      const customers = snapshot.val();

      tableBody.innerHTML = "";

      if (!customers) {
        tableBody.innerHTML = "<tr><td colspan='6'>No patient bookings yet.</td></tr>";
        return;
      }

      Object.entries(customers).reverse().forEach(([id, patient]) => {
        const nameMatch = patient.name.toLowerCase().includes(searchInput.value.toLowerCase());
        const statusMatch = statusFilter.value === "all" || patient.appointmentStatus === statusFilter.value;
        const paymentMatch = paymentFilter.value === "all" || (patient.paymentStatus || "pending").toLowerCase() === paymentFilter.value;

        if (!nameMatch || !statusMatch || !paymentMatch) return;

        const row = document.createElement("tr");

        let statusClass = "";
        if (patient.appointmentStatus === "accepted") {
          statusClass = "status-accepted";
        } else if (patient.appointmentStatus === "rejected") {
          statusClass = "status-rejected";
        } else if (patient.appointmentStatus === "rescheduled") {
          statusClass = "status-rescheduled";
        }

        row.className = `unread ${statusClass}`.trim();

        let bookingTime = "Not scheduled";
        if (patient.appointmentDate && patient.appointmentTime) {
          bookingTime = `${patient.appointmentDate} at ${patient.appointmentTime}`;
        } else if (patient.timestamp) {
          bookingTime = new Date(patient.timestamp).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short"
          });
        }

        const paymentStatus = (patient.paymentStatus || "Pending").toLowerCase();
        const paymentDisplay = paymentStatus === "paid"
          ? `<span class="badge paid">Paid</span>`
          : `<button class="mark-paid-btn" data-id="${id}">Mark as Paid</button>`;

        row.innerHTML = `
          <td>${patient.name}</td>
          <td>${bookingTime}</td>
          <td>${paymentDisplay}</td>
          <td>
            <input type="checkbox" data-id="${id}" class="informed-checkbox" ${patient.informed ? "checked" : ""}>
          </td>
          <td><span class="status-badge">
            ${patient.appointmentStatus
              ? patient.appointmentStatus.charAt(0).toUpperCase() + patient.appointmentStatus.slice(1)
              : 'Unread'}
          </span></td>
          <td><button class="view-btn" data-id="${id}">🔍 View</button></td>
        `;

        tableBody.appendChild(row);

        const viewBtn = row.querySelector(".view-btn");
        viewBtn.addEventListener("click", () => {
          row.classList.remove("unread");
          row.classList.add("read");

          const frame = document.getElementById("patient-frame");
          frame.src = `view-patient.html?patientId=${id}`;
          document.getElementById("view-patient-popup").style.display = "block";
        });

        const informedCheckbox = row.querySelector(".informed-checkbox");
        informedCheckbox.addEventListener("change", () => {
          const isChecked = informedCheckbox.checked;
          database.ref(`customers/${id}/informed`).set(isChecked)
            .then(() => {
              console.log(`Informed updated for ${id}: ${isChecked}`);
            })
            .catch(err => {
              console.error("Error updating informed:", err);
            });
        });

        const markPaidBtn = row.querySelector(".mark-paid-btn");
        if (markPaidBtn) {
          markPaidBtn.addEventListener("click", () => {
            const confirmPay = confirm("Mark this payment as completed? It can't be changed later.");
            if (!confirmPay) return;

            database.ref(`customers/${id}/paymentStatus`).set("paid")
              .then(() => {
                loadPatients();
              })
              .catch(err => {
                console.error("Error updating payment status:", err);
              });
          });
        }
      });
    })
    .catch(error => {
      console.error("Error loading patient data:", error);
      tableBody.innerHTML = "<tr><td colspan='6'>Failed to load data.</td></tr>";
    });
}

searchInput.addEventListener("input", loadPatients);
statusFilter.addEventListener("change", loadPatients);
paymentFilter.addEventListener("change", loadPatients);

loadPatients();

function closePatientPopup() {
  document.getElementById("view-patient-popup").style.display = "none";
  document.getElementById("patient-frame").src = "";
}
