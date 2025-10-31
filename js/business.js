// js/business.js
import { auth, db } from "./firebase-config.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { logAction } from "./logger.js";

const logoutBtn = document.getElementById("logoutBtn");
const ideaForm = document.getElementById("ideaForm");
const ideasList = document.getElementById("ideasList");
const status = document.getElementById("status");

let currentUser;

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location = "login.html";
    return;
  }
  currentUser = user;
  await loadIdeas();
});

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location = "login.html";
  });
}

if (ideaForm) {
  ideaForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const funding = document.getElementById("funding").value;

    try {
      await addDoc(collection(db, "businessIdeas"), {
        title,
        description,
        funding,
        postedBy: currentUser.uid,
        createdAt: serverTimestamp(),
      });
      await logAction(currentUser.uid, "post_idea", { title });
      status.textContent = "Idea posted!";
      ideaForm.reset();
      await loadIdeas();
    } catch (err) {
      status.textContent = "Error: " + err.message;
    }
  });
}

async function loadIdeas() {
  ideasList.innerHTML = "";
  const q = query(collection(db, "businessIdeas"), where("postedBy", "==", currentUser.uid));
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    ideasList.innerHTML = "<li>No ideas posted yet.</li>";
    return;
  }
  snapshot.forEach((doc) => {
    const data = doc.data();
    const li = document.createElement("li");
    li.textContent = `${data.title} — ₹${data.funding}`;
    ideasList.appendChild(li);
  });
}
