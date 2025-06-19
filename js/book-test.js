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

const container = document.getElementById("test-cards-container");
const goToCartBtn = document.getElementById("go-to-cart-btn");
const cartCountBadge = document.getElementById("cart-count-badge");

// Clear the container just in case
container.innerHTML = "";

// Step 1: Assign a cart ID for the session (or get from localStorage)
let userCartId = localStorage.getItem("userCartId");
if (!userCartId) {
  userCartId = `cart_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
  localStorage.setItem("userCartId", userCartId);
}

// Step 2: Fetch all tests from Firebase and render
database.ref("tests").once("value")
  .then(snapshot => {
    snapshot.forEach(childSnapshot => {
      const test = childSnapshot.val();
      const testId = childSnapshot.key;

      const card = document.createElement("div");
      card.className = "test-card";

      card.innerHTML = `
        <div class="test-name">${test.name}</div>
        <div class="test-desc">${test.description}</div>
        <div class="test-info">🧪 Sample: ${test.sample}</div>
        <div class="test-info">⏱ Delivery: ${test.deliveryTime}</div>
        <div class="test-price">₹${test.price}</div>
        <button class="add-to-cart-btn" data-id="${testId}">Add to Cart</button>
      `;

      card.querySelector(".add-to-cart-btn").addEventListener("click", () => {
        addToCart(testId, test);
      });

      container.appendChild(card);
    });
  })
  .catch(error => {
    console.error("Error fetching tests:", error);
  });

// Step 3: Add test to Firebase cart collection
function addToCart(testId, test) {
  const cartRef = database.ref(`carts/${userCartId}/items/${testId}`);
  cartRef.set(test)
    .then(() => {
      alert(`${test.name} added to cart!`);
      updateCartCount();
    })
    .catch(error => {
      console.error("Error adding to cart:", error);
    });
}

// Step 4: Cart count update logic
function updateCartCount() {
  const cartRef = database.ref(`carts/${userCartId}/items`);
  cartRef.once("value").then(snapshot => {
    const count = snapshot.numChildren();
    if (cartCountBadge) {
      cartCountBadge.innerText = count;
      cartCountBadge.style.display = count > 0 ? "inline-block" : "none";
    }
  });
}

// Step 5: On page load, show count if cart already has items
updateCartCount();

// Step 6: Redirect to cart page
if (goToCartBtn) {
  goToCartBtn.addEventListener("click", () => {
    window.location.href = "go-to-cart.html";
  });
}
