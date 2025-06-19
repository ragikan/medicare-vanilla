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

const cartContainer = document.getElementById("cart-container");
const cartTotalEl = document.getElementById("cart-total");

// Get cart ID from localStorage
const userCartId = localStorage.getItem("userCartId");

if (!userCartId) {
  cartContainer.innerHTML = "<p>No cart found. Please add tests first.</p>";
} else {
  const cartItemsRef = database.ref(`carts/${userCartId}/items`);

  cartItemsRef.once("value")
    .then(snapshot => {
      let total = 0;

      if (!snapshot.exists()) {
        cartContainer.innerHTML = "<p>Your cart is empty.</p>";
        return;
      }

      snapshot.forEach(child => {
        const test = child.val();
        const testKey = child.key;

        // Create card
        const card = document.createElement("div");
        card.className = "test-card";

        card.innerHTML = `
          <div class="test-name">${test.name}</div>
          <div class="delete-icon" data-id="${testKey}">🗑️</div>
          <div class="test-price">₹${test.price}</div>
        `;

        // Add delete icon functionality
        card.querySelector(".delete-icon").addEventListener("click", () => {
          if (confirm(`Remove "${test.name}" from cart?`)) {
            database.ref(`carts/${userCartId}/items/${testKey}`).remove()
              .then(() => location.reload());
          }
        });

        // Add to DOM & total
        cartContainer.insertBefore(card, cartTotalEl);
        total += parseFloat(test.price);
      });

      cartTotalEl.innerText = `Total: ₹${total}`;
    })
    .catch(error => {
      console.error("Error loading cart items:", error);
      cartContainer.innerHTML = "<p>Error loading cart. Please try again.</p>";
    });
}

// Proceed to Pay
document.querySelector(".proceed-btn").addEventListener("click", () => {
  alert("Proceeding to payment 🚀 (Feature coming soon!)");
});


const proceedBtn = document.querySelector(".proceed-btn");

if (proceedBtn) {
  proceedBtn.addEventListener("click", () => {
    window.location.href = "payment-portal.html";
  });
}