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


const form = document.getElementById("create-blog-form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("blog-title").value.trim();
  const summary = document.getElementById("blog-summary").value.trim();
  const content = document.getElementById("blog-content").value.trim();
  const image = document.getElementById("blog-image-url").value.trim();

  if (!title || !summary || !content || !image) {
    alert("Please fill in all fields before publishing.");
    return;
  }

  const newBlog = {
    title,
    summary,
    content,
    image,
    createdAt: new Date().toISOString()
  };

  database.ref("blogs").push(newBlog)
    .then(() => {
      alert("✅ Blog published successfully!");
      form.reset();
    })
    .catch((error) => {
      alert("❌ Error publishing blog: " + error.message);
    });
});
