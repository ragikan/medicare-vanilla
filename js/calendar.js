const firebaseConfig = {
  apiKey: "AIzaSyAE3pZq_XBsVNmvh5ML-nSLUM8xVTlrrS8",
  authDomain: "medicare-vanilla.firebaseapp.com",
  databaseURL: "https://medicare-vanilla-default-rtdb.firebaseio.com/",
  projectId: "medicare-vanilla",
  storageBucket: "medicare-vanilla.firebasestorage.app",
  messagingSenderId: "595653600625",
  appId: "1:595653600625:web:9799959a6142ebed2582d0"
};


  // ✅ Firebase initialization
  firebase.initializeApp(firebaseConfig);
  const database = firebase.database(); 
  const auth = firebase.auth();

  document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');

    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek'
      },
      events: [],
      eventClick: function(info) {
        alert(`Appointment with ${info.event.title} at ${info.event.start.toLocaleTimeString()}`);
      }
    });

    calendar.render();

    // ✅ Fetch appointments from Realtime Database
    database.ref("customers").once("value")
      .then(snapshot => {
        const customers = snapshot.val();
        const events = [];

        for (const customerId in customers) {
          const data = customers[customerId];

          if (data.appointmentDate && data.appointmentTime) {
            const fullDateTimeStr = `${data.appointmentDate}T${data.appointmentTime}`;
            const fullDateTime = new Date(fullDateTimeStr);

            if (!isNaN(fullDateTime)) {
              events.push({
                title: `${data.name} (${data.status})`,
                start: fullDateTime,
                backgroundColor: getStatusColor(data.status),
                borderColor: '#999',
                display: 'block'
              });
            } else {
              console.warn("⚠️ Invalid date/time for:", data.name, fullDateTimeStr);
            }
          }

          // Debug: show raw status
          console.log("🔎 Status for", data.name, "is:", `"${data.status}"`);
        }

        calendar.addEventSource(events);
        console.log("✅ Events loaded into calendar:", events);
      })
      .catch(error => {
        console.error("🔥 Firebase DB fetch error:", error);
      });

    // 🎨 Color logic based on appointment status
    function getStatusColor(status = '') {
      const cleaned = status.trim().toLowerCase();

      switch (cleaned) {
        case 'cancelled': return '#f87171';   // red ❌
        case 'accepted':  return '#4ade80';   // green ✅
        case 'pending':   // fallback if this ever exists
        case '':          return '#facc15';   // yellow ⚠️ (no status = pending?)
        default:          return '#cbd5e1';   // gray = unknown
      }
    }
  });

