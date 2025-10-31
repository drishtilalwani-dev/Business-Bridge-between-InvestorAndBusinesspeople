import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { addDoc, collection, getDocs, query, where, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { logAction } from "./logger.js";

const logoutBtn = document.getElementById("logoutBtn");
const loanForm = document.getElementById("loanForm");
const loanList = document.getElementById("loanList");
let currentUser;

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location = "login.html";
    return;
  }
  currentUser = user;
  await loadLoans();
});

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location = "login.html";
  });
}

if (loanForm) {
  loanForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const loanName = document.getElementById("loanName").value;
    const loanDescription = document.getElementById("loanDescription").value;
    const interestRate = document.getElementById("interestRate").value;

    await addDoc(collection(db, "loanDetails"), {
      loanName,
      loanDescription,
      interestRate,
      postedBy: currentUser.uid,
      createdAt: serverTimestamp(),
    });

    await logAction(currentUser.uid, "post_loan", { loanName });
    alert("Loan details posted successfully!");
    loanForm.reset();
    await loadLoans();
  });
}

async function loadLoans() {
  loanList.innerHTML = "";
  const q = query(collection(db, "loanDetails"), where("postedBy", "==", currentUser.uid));
  const snapshot = await getDocs(q);
  snapshot.forEach((doc) => {
    const data = doc.data();
    const li = document.createElement("li");
    li.textContent = `${data.loanName} - ${data.interestRate}% interest`;
    loanList.appendChild(li);
  });
}
