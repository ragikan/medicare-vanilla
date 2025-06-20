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

// Elements
const collectionType = document.getElementById("collection-type");
const homeAddress = document.getElementById("home-address-field");
const labAddressNote = document.getElementById("lab-address-note");
const payLaterBtn = document.getElementById("pay-later-btn");
const payOnlineBtn = document.getElementById("pay-online-btn");
const bookingForm = document.getElementById("booking-form");

// 👀 Show/Hide Address Fields
collectionType.addEventListener("change", () => {
  const value = collectionType.value;
  homeAddress.style.display = value === "home" ? "block" : "none";
  labAddressNote.style.display = value === "lab" ? "block" : "none";
});

// 👉 Pay Online (simulate for now)
payOnlineBtn.addEventListener("click", async () => {
  const formData = new FormData(bookingForm);

  const name = formData.get("name")?.trim();
  const age = formData.get("age")?.trim();
  const phone = formData.get("phone")?.trim();
  const collection = formData.get("collectionType");
  const address = collection === "home" ? formData.get("address")?.trim() : "Will visit pathology";
  const appointmentDate = formData.get("appointmentDate");
  const appointmentTime = formData.get("appointmentTime");

  if (!name || !age || !phone || !collection || !appointmentDate || !appointmentTime) {
    return alert("Please fill in all required fields!");
  }

  const userCartId = localStorage.getItem("userCartId");
  if (!userCartId) {
    return alert("No cart found. Please add tests before booking.");
  }

  try {
    const snapshot = await database.ref(`carts/${userCartId}/items`).once("value");
    const tests = snapshot.val() || {};

    const customerData = {
      name,
      age,
      phone,
      collectionType: collection,
      address,
      appointmentDate,
      appointmentTime,
      paymentMethod: "Pay Online",
      paymentStatus: "paid",  // 🟢 Marked as paid
      tests,
      timestamp: new Date().toISOString()
    };

    const uniqueId = Date.now();
    await database.ref(`customers/${name}-${uniqueId}`).set(customerData);

    // ♻️ Reset Cart ID
    localStorage.removeItem("userCartId");
    const newCartId = `cart_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
    localStorage.setItem("userCartId", newCartId);

    // 🚀 Redirect to thank you page
    window.location.href = "thank-you.html";
  } catch (error) {
    alert("Error saving booking: " + error.message);
  }
});


// 👉 Pay Later Handler
payLaterBtn.addEventListener("click", async () => {
  const formData = new FormData(bookingForm);

  const name = formData.get("name")?.trim();
  const age = formData.get("age")?.trim();
  const phone = formData.get("phone")?.trim();
  const collection = formData.get("collectionType");
  const address = collection === "home" ? formData.get("address")?.trim() : "Will visit pathology";
  const appointmentDate = formData.get("appointmentDate");
  const appointmentTime = formData.get("appointmentTime");

  if (!name || !age || !phone || !collection || !appointmentDate || !appointmentTime) {
    return alert("Please fill in all required fields!");
  }

  const userCartId = localStorage.getItem("userCartId");
  if (!userCartId) {
    return alert("No cart found. Please add tests before booking.");
  }

  try {
    const snapshot = await database.ref(`carts/${userCartId}/items`).once("value");
    const tests = snapshot.val() || {};

    const customerData = {
      name,
      age,
      phone,
      collectionType: collection,
      address,
      appointmentDate,
      appointmentTime,
      paymentMethod: "Pay After Test",
      paymentStatus: "pending", // ✅ Add this for status tracking
      tests,
      timestamp: new Date().toISOString()
    };

    const uniqueId = Date.now();
    await database.ref(`customers/${name}-${uniqueId}`).set(customerData);

    // ♻️ Reset Cart ID
    localStorage.removeItem("userCartId");
    const newCartId = `cart_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
    localStorage.setItem("userCartId", newCartId);

    // 🚀 Redirect
    window.location.href = "thank-you.html";
  } catch (error) {
    alert("Error saving booking: " + error.message);
  }
});
