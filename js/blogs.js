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


const blogContainer = document.getElementById("blog-container");

// Fetch blog posts from Realtime Database
database.ref("blogs").once("value")
  .then(snapshot => {
    const blogs = snapshot.val();

    if (!blogs) {
      blogContainer.innerHTML = "<p>No blogs available yet.</p>";
      return;
    }

    // Show most recent blogs first
    Object.entries(blogs).reverse().forEach(([id, blog]) => {
      const card = document.createElement("div");
      card.className = "blog-card";

      card.innerHTML = `
        <img src="${blog.image}" alt="Blog Image" />
        <div class="content">
          <h3>${blog.title}</h3>
          <p>${blog.summary}</p>
        </div>
      `;

        card.addEventListener('click', () => {
         window.location.href = `unique-blog.html?blogId=${id}`;
        });

      blogContainer.appendChild(card);

    });
  })
  .catch(err => {
    console.error("🚨 Error fetching blogs:", err);
    blogContainer.innerHTML = "<p>Oops, something went wrong.</p>";
  });
