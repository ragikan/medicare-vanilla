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

    // ⬇️ Append patient info (not replacing existing HTML)
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

    // ✅ Render test list
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

    // 💥 Buttons at the bottom
    
    

    //buttons 
    // 👉 Create buttons
const acceptBtn = document.createElement("button");
acceptBtn.textContent = "✅ Accept";


const rescheduleBtn = document.createElement("button");
rescheduleBtn.textContent = "📆 Reschedule";


const rejectBtn = document.createElement("button");
rejectBtn.textContent = "❌ Reject";

// 👉 Button group
const buttonGroup = document.createElement("div");
buttonGroup.className = "action-buttons";
buttonGroup.appendChild(acceptBtn);
buttonGroup.appendChild(rescheduleBtn);
buttonGroup.appendChild(rejectBtn);

card.appendChild(buttonGroup);
})