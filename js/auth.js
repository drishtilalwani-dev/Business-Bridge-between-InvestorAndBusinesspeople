// js/auth.js
import { auth, db } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import {
  setDoc,
  doc,
  getDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { logAction } from "./logger.js";

/* 
   REGISTER
 */
const regForm = document.getElementById("registerForm");
if (regForm) {
  regForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;
    const msg = document.getElementById("msg");

    msg.style.color = "#1e88e5";
    msg.textContent = "Registering...";

    try {
      // Create user account
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      // Save user details to Firestore
      await setDoc(doc(db, "users", uid), {
        name,
        email,
        role,
        createdAt: serverTimestamp(),
      });

      // Log the registration
      await logAction(uid, "register", { role });

      msg.style.color = "green";
      msg.textContent = "Registered successfully! Redirecting to login...";

      setTimeout(() => {
        window.location = "login.html";
      }, 2000);
    } catch (error) {
      msg.style.color = "red";
      msg.textContent = "❌ " + error.message;
    }
  });
}

/* 
   LOGIN
 */
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const msg = document.getElementById("msg");

    msg.style.color = "#1e88e5";
    msg.textContent = "Logging in...";

    try {
      // Sign in the user
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      // Fetch user role
      const userDoc = await getDoc(doc(db, "users", uid));
      if (!userDoc.exists()) {
        msg.style.color = "red";
        msg.textContent = " User record not found in database.";
        return;
      }

      const role = userDoc.data().role;

      // Log the login
      await logAction(uid, "login", { role });

      msg.style.color = "green";
      msg.textContent = "Login successful! Redirecting...";

      // Role-based redirection
      setTimeout(() => {
        if (role === "business") window.location = "business-dashboard.html";
        else if (role === "investor") window.location = "investor-dashboard.html";
        else if (role === "banker") window.location = "banker-dashboard.html";
        else if (role === "advisor") window.location = "advisor-dashboard.html";
        else if (role === "user") window.location = "user-dashboard.html";
        else window.location = "index.html";
      }, 2000);
    } catch (error) {
      msg.style.color = "red";
      msg.textContent = "❌ " + error.message;
    }
  });
}

