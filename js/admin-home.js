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

const adminEmail = "girish696@gmail.com";

document.getElementById('admin-login-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const email = document.getElementById('admin-email').value.trim();
  const password = document.getElementById('admin-password').value;
  const errorMsg = document.getElementById('login-error');
  const loginBtn = document.querySelector("button[type='submit']");

  if (email !== adminEmail) {
    errorMsg.textContent = "Unauthorized email.";
    return;
  }

  // Disable button and show loading
  loginBtn.disabled = true;
  errorMsg.textContent = "Logging in...";

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      window.location.href = "admin-dashboard.html"; // Redirect after login
    })
    .catch((error) => {
      errorMsg.textContent = "Login failed. " + error.message;
      loginBtn.disabled = false;
    });
});
