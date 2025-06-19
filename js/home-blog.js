

const blogContainer = document.getElementById("blog-container");

// Add a check to ensure blogContainer exists
if (blogContainer) {
  database.ref("blogs").once("value")
    .then(snapshot => {
      const blogs = snapshot.val();

      if (!blogs) {
        blogContainer.innerHTML = "<p>No blogs available yet.</p>";
        return;
      }

      // Reverse the entries to show latest first
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

        // Add click to redirect to blog detail page with blogId in URL
        card.addEventListener("click", () => {
          window.location.href = `unique-blog.html?blogId=${id}`;
        });

        blogContainer.appendChild(card);
      });
    })
    .catch(err => {
      console.error("🚨 Error fetching blogs:", err);
      blogContainer.innerHTML = "<p>Oops, something went wrong.</p>";
    });
}



