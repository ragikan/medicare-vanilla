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

// Live preview updates
    document.getElementById("test-name").addEventListener("input", e => {
      document.getElementById("preview-name").textContent = e.target.value || "Test Name";
    });

    document.getElementById("test-desc").addEventListener("input", e => {
      document.getElementById("preview-desc").textContent = e.target.value || "Test description will appear here...";
    });

    document.getElementById("test-price").addEventListener("input", e => {
      document.getElementById("preview-price").textContent = "₹" + (e.target.value || "0");
    });

    document.getElementById("test-sample").addEventListener("input", e => {
      document.getElementById("preview-sample").textContent = e.target.value || "N/A";
    });

    document.getElementById("test-delivery").addEventListener("input", e => {
      document.getElementById("preview-delivery").textContent = e.target.value || "N/A";
    });












document.getElementById("add-test-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const testName = document.getElementById("test-name").value.trim();
  const testDesc = document.getElementById("test-desc").value.trim();
  const testPrice = document.getElementById("test-price").value.trim();
  const testSample = document.getElementById("test-sample").value.trim();
  const testDelivery = document.getElementById("test-delivery").value.trim();

  if (!testName || !testDesc || !testPrice || !testSample || !testDelivery) {
    alert("Please fill in all fields!");
    return;
  }

  const newTestRef = database.ref("tests").push(); // Unique ID node

  const testData = {
    name: testName,
    description: testDesc,
    price: testPrice,
    sample: testSample,
    deliveryTime: testDelivery,
    createdAt: new Date().toISOString()
  };

  newTestRef.set(testData)
    .then(() => {
      alert("✅ Test added successfully!");
      document.getElementById("add-test-form").reset();
    })
    .catch((error) => {
      console.error("❌ Error adding test: ", error);
      alert("Something went wrong: " + error.message);
    });
});

