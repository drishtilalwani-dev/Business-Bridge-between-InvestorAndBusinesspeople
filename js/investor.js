import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { collection, addDoc, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { logAction } from "./logger.js";

const ideasList = document.getElementById("ideasList");
const proposalForm = document.getElementById("proposalForm");
const logoutBtn = document.getElementById("logoutBtn");

let currentUser;
let selectedIdeaId = null;

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

async function loadIdeas() {
  ideasList.innerHTML = "";
  const snapshot = await getDocs(collection(db, "businessIdeas"));
  snapshot.forEach((doc) => {
    const data = doc.data();
    const li = document.createElement("li");
    li.innerHTML = `<b>${data.title}</b> — ₹${data.funding} 
      <button data-id="${doc.id}">Propose</button>`;
    ideasList.appendChild(li);
  });

  ideasList.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      selectedIdeaId = e.target.dataset.id;
      document.getElementById("proposalSection").style.display = "block";
    }
  });
}

if (proposalForm) {
  proposalForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const amount = document.getElementById("amount").value;
    const message = document.getElementById("message").value;

    await addDoc(collection(db, "investorProposals"), {
      ideaId: selectedIdeaId,
      investorId: currentUser.uid,
      amount,
      message,
      createdAt: serverTimestamp(),
    });

    await logAction(currentUser.uid, "post_proposal", { ideaId: selectedIdeaId });
    alert("✅ Proposal sent successfully!");
    proposalForm.reset();
    document.getElementById("proposalSection").style.display = "none";
  });
}
