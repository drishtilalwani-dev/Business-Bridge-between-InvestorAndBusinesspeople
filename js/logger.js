// js/logger.js
import { addDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { db } from "./firebase-config.js";

export async function logAction(uid, action, details = {}) {
  try {
    await addDoc(collection(db, "logs"), {
      uid,
      action,
      details,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error("Log error:", error);
  }
}
