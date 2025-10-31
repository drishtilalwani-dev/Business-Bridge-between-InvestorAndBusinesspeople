// js/user.js
import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { collection, getDocs, orderBy, query } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { logAction } from "./logger.js";

const logoutBtn = document.getElementById("logoutBtn");
const categoriesList = document.getElementById("categoriesList");
let currentUser;

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location = "login.html";
    return;
  }
  currentUser = user;
  await logAction(user.uid, "open_user_dashboard");
  await loadCategories();
});

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location = "login.html";
  });
}

async function loadCategories() {
  categoriesList.innerHTML = "<li>Loading categories...</li>";

  try {
    const q = query(collection(db, "categories"), orderBy("name"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      categoriesList.innerHTML = "<li>No categories found. Please contact admin to add some.</li>";
      return;
    }

    categoriesList.innerHTML = "";
    snapshot.forEach((doc) => {
      const data = doc.data();
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${data.name}</strong><br>
        <small>${data.description}</small>
      `;
      categoriesList.appendChild(li);
    });
  } catch (error) {
    console.error("Error loading categories:", error);
    categoriesList.innerHTML = `<li style="color:red;">Error loading categories: ${error.message}</li>`;
  }
}
