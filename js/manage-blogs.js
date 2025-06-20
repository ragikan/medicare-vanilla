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


const blogListContainer = document.getElementById("blog-list-admin");

// 🔥 Load existing blogs from Firebase
database.ref("blogs").once("value")
  .then(snapshot => {
    const blogs = snapshot.val();

    if (!blogs) {
      blogListContainer.innerHTML = "<p>No blogs to manage yet.</p>";
      return;
    }

    Object.entries(blogs).reverse().forEach(([id, blog]) => {
      const blogCard = document.createElement("div");
      blogCard.className = "blog-card-admin";

      blogCard.innerHTML = `
        <h3>${blog.title}</h3>
        <p><strong>Summary:</strong> ${blog.summary}</p>
        <div class="admin-blog-buttons">
          <button onclick="editBlog('${id}')">✏️ Edit</button>
          <button onclick="deleteBlog('${id}')">🗑️ Delete</button>
        </div>
      `;

      blogListContainer.appendChild(blogCard);
    });
  })
  .catch(error => {
    console.error("Error loading blogs:", error);
    blogListContainer.innerHTML = "<p>Failed to load blog list.</p>";
  });


  function deleteBlog(id) {
  const confirmDelete = confirm("Are you sure you want to delete this blog?");
  if (!confirmDelete) return;

  database.ref(`blogs/${id}`).remove()
    .then(() => {
      alert("🗑️ Blog deleted successfully!");
      location.reload(); // Refresh to reflect changes
    })
    .catch(err => {
      console.error("❌ Failed to delete blog:", err);
      alert("Error deleting blog. Please try again.");
    });
}

document.getElementById("add-blog-btn").addEventListener("click", () => {
  // Redirect with no blogId — blank editor
  window.location.href = "edit-blog.html";
});


function editBlog(id) {
  window.location.href = `edit-blog.html?blogId=${id}`;
}