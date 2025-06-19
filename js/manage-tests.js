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

const testsTableBody = document.getElementById('tests-table-body');

database.ref('tests').on('value', (snapshot) => {
  testsTableBody.innerHTML = ''; // Clear table before adding new rows

  snapshot.forEach((childSnapshot) => {
    const test = childSnapshot.val();
    const key = childSnapshot.key;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${test.name}</td>
      <td>${test.description}</td>
      <td>₹${test.price}</td>
      <td>
        <button class="edit-btn" onclick="editTest('${key}')">Edit</button>
        <button class="delete-btn" onclick="deleteTest('${key}')">Delete</button>
      </td>
    `;
    testsTableBody.appendChild(row);
  });
});

function deleteTest(key) {
  if (confirm("Are you sure you want to delete this test?")) {
    database.ref('tests/' + key).remove()
      .then(() => {
        alert("Test deleted successfully.");
      })
      .catch((error) => {
        alert("Error deleting test: " + error.message);
      });
  }
}

let currentEditKey = null;

function editTest(key) {
  currentEditKey = key;
  const testRef = database.ref('tests/' + key);

  testRef.once('value').then(snapshot => {
    const test = snapshot.val();
    document.getElementById('edit-test-name').value = test.name || '';
    document.getElementById('edit-test-desc').value = test.description || '';
    document.getElementById('edit-test-price').value = test.price || '';
    document.getElementById('edit-test-sample').value = test.sample || '';
    document.getElementById('edit-test-delivery').value = test.deliveryTime || '';

    document.getElementById('edit-modal').style.display = 'flex';
  });
}

document.getElementById('cancel-edit').addEventListener('click', () => {
  document.getElementById('edit-modal').style.display = 'none';
  currentEditKey = null;
});

document.getElementById('edit-test-form').addEventListener('submit', function(e) {
  e.preventDefault();
  if (!currentEditKey) return;

  const updatedData = {
    name: document.getElementById('edit-test-name').value.trim(),
    description: document.getElementById('edit-test-desc').value.trim(),
    price: document.getElementById('edit-test-price').value.trim(),
    sample: document.getElementById('edit-test-sample').value.trim(),
    deliveryTime: document.getElementById('edit-test-delivery').value.trim(),
    updatedAt: new Date().toISOString()
  };

  database.ref('tests/' + currentEditKey).update(updatedData)
    .then(() => {
      alert("✅ Test updated!");
      document.getElementById('edit-modal').style.display = 'none';
    })
    .catch((error) => {
      alert("❌ Update failed: " + error.message);
    });
});




document.getElementById('add-test-btn').addEventListener('click', () => {
  window.location.href = "add-test.html";
});

