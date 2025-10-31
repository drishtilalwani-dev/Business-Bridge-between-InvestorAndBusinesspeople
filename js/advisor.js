import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { collection, addDoc, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { logAction } from "./logger.js";

const logoutBtn = document.getElementById("logoutBtn");
const infoForm = document.getElementById("infoForm");
const queryList = document.getElementById("queryList");
const solutionForm = document.getElementById("solutionForm");

let currentUser;
let selectedQueryId = null;

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location = "login.html";
    return;
  }
  currentUser = user;
  await loadQueries();
});

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location = "login.html";
  });
}

if (infoForm) {
  infoForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("infoTitle").value;
    const description = document.getElementById("infoDesc").value;

    await addDoc(collection(db, "advisorInfo"), {
      title,
      description,
      postedBy: currentUser.uid,
      createdAt: serverTimestamp(),
    });

    await logAction(currentUser.uid, "post_information", { title });
    alert("Information posted!");
    infoForm.reset();
  });
}

async function loadQueries() {
  queryList.innerHTML = "";
  const snapshot = await getDocs(collection(db, "queries"));
  snapshot.forEach((doc) => {
    const data = doc.data();
    const li = document.createElement("li");
    li.innerHTML = `<b>${data.query}</b>
      <button data-id="${doc.id}">Answer</button>`;
    queryList.appendChild(li);
  });

  queryList.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      selectedQueryId = e.target.dataset.id;
      document.getElementById("solutionSection").style.display = "block";
    }
  });
}

if (solutionForm) {
  solutionForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = document.getElementById("solutionText").value;
    await addDoc(collection(db, "solutions"), {
      queryId: selectedQueryId,
      advisorId: currentUser.uid,
      solution: text,
      createdAt: serverTimestamp(),
    });

    await logAction(currentUser.uid, "post_solution", { queryId: selectedQueryId });
    alert("Solution posted!");
    solutionForm.reset();
    document.getElementById("solutionSection").style.display = "none";
  });
}
