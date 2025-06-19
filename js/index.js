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

  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  hamburger.addEventListener('click', function(){
    navLinks.classList.toggle('show');
    hamburger.classList.toggle('active'); 
  });

  window.addEventListener('DOMContentLoaded', () => {
    fetch('home.html')  // Your home content file
      .then(res => res.text())
      .then(data => {
        document.getElementById('main-content').innerHTML = data;
      });
  });

  window.addEventListener('DOMContentLoaded', () => {
    fetch('about-us.html')  // Your home content file
      .then(res => res.text())
      .then(data => {
        document.getElementById('about-content').innerHTML = data;
      });
  });

  window.addEventListener('DOMContentLoaded', () => {
    fetch('home-blog.html')  // Your home content file
      .then(res => res.text())
      .then(data => {
        document.getElementById('home-blog').innerHTML = data;

        const script = document.createElement('script');
    script.src = '../js/home-blog.js';
    script.defer = true;
    document.body.appendChild(script);
      });
  });