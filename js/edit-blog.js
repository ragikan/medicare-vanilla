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

const urlParams = new URLSearchParams(window.location.search);
const blogId = urlParams.get("blogId"); // null if creating new

const titleEl = document.getElementById("title");
const summaryEl = document.getElementById("summary");
const contentEl = document.getElementById("content");
const imageInput = document.getElementById("image-url");
const blogImage = document.getElementById("blog-image");

// 🔁 Sync image input with preview
imageInput.addEventListener("input", () => {
  blogImage.src = imageInput.value;
});

// 🧠 If editing, fetch blog data
if (blogId) {
  database.ref(`blogs/${blogId}`).once("value")
    .then(snapshot => {
      const blog = snapshot.val();
      if (!blog) return alert("Blog not found.");

      titleEl.textContent = blog.title || "";
      summaryEl.textContent = blog.summary || "";
      contentEl.textContent = blog.content || "";
      imageInput.value = blog.image || "";
      blogImage.src = blog.image || "";
    })
    .catch(err => alert("Error loading blog: " + err.message));
}

// 📤 Save blog (create or update)
function saveBlog() {
  const title = titleEl.textContent.trim();
  const summary = summaryEl.textContent.trim();
  const content = contentEl.textContent.trim();
  const image = imageInput.value.trim();

  if (!title || !summary || !content || !image) {
    return alert("Please fill in all fields before publishing.");
  }

  const blogData = {
    title,
    summary,
    content,
    image,
    createdAt: new Date().toISOString(),
  };

  if (blogId) {
    // ✏️ Update existing blog
    database.ref(`blogs/${blogId}`).update(blogData)
      .then(() => {
        alert("Blog updated successfully ✨");
        window.location.href = "manage-blogs.html";
      })
      .catch(err => alert("Update failed: " + err.message));
  } else {
    // 🆕 Create new blog
    database.ref("blogs").push(blogData)
      .then(() => {
        alert("Blog published successfully 🚀");
        window.location.href = "manage-blogs.html";
      })
      .catch(err => alert("Publish failed: " + err.message));
  }
}


if (blogId) {
  // Edit Mode: Fetch blog and populate
  database.ref(`blogs/${blogId}`).once("value")
    .then(snapshot => {
      const blog = snapshot.val();
      if (!blog) return alert("Blog not found!");

      document.getElementById("title").innerText = blog.title;
      document.getElementById("image").src = blog.image;
      document.getElementById("summary").innerText = blog.summary;
      document.getElementById("content").innerText = blog.content;

      // Save with same blogId
      document.getElementById("save-btn").onclick = () => {
        const updatedBlog = {
          title: document.getElementById("title").innerText,
          image: document.getElementById("image").src,
          summary: document.getElementById("summary").innerText,
          content: document.getElementById("content").innerText,
          updatedAt: new Date().toISOString()
        };
        database.ref(`blogs/${blogId}`).update(updatedBlog)
          .then(() => alert("✅ Blog updated"))
          .catch(err => alert("Error: " + err.message));
      };
    });
} else {
  // Add Mode: Save new blog
  document.getElementById("save-btn").onclick = () => {
    const newBlog = {
      title: document.getElementById("title").innerText,
      image: document.getElementById("image").src,
      summary: document.getElementById("summary").innerText,
      content: document.getElementById("content").innerText,
      createdAt: new Date().toISOString()
    };
    database.ref("blogs").push(newBlog)
      .then(() => alert("✅ Blog added"))
      .catch(err => alert("Error: " + err.message));
  };
}
