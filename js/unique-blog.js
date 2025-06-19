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
 

// 👇 Get blogId from URL
const params = new URLSearchParams(window.location.search);
const blogId = params.get("blogId");

if (!blogId) {
  document.getElementById("blog-title").innerText = "⚠️ Blog not found";
  throw new Error("No blog ID provided in URL.");
}

// 👇 Fetch from Firebase
database.ref(`blogs/${blogId}`).once("value")
  .then(snapshot => {
    const blog = snapshot.val();

    if (!blog) {
      document.getElementById("blog-title").innerText = "⚠️ Blog not found";
      return;
    }

    document.getElementById("blog-title").innerText = blog.title;
    document.getElementById("blog-summary").innerText = blog.summary;
    document.getElementById("blog-content").innerText = blog.content;

    const img = document.getElementById("blog-image");
    if (blog.image) {
      img.src = blog.image;
      img.style.display = "block";
    }
  })
  .catch(err => {
    console.error("Error loading blog:", err);
    document.getElementById("blog-title").innerText = "❌ Failed to load blog.";
  });
