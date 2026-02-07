import {
  collection, addDoc, getDocs, query, where,
  updateDoc, doc, increment
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

export async function loadTasks(db) {
  const q = query(collection(db, "tasks"), where("status", "==", "active"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function completeTask(db, task, userRef) {
  if (task.clicks_done >= task.clicks_required) return;

  await updateDoc(doc(db, "tasks", task.id), {
    clicks_done: increment(1)
  });

  await updateDoc(userRef, {
    balance: increment(task.reward),
    tasks_completed: increment(1)
  });

  Telegram.WebApp.HapticFeedback.notificationOccurred("success");
}
export async function createPaidTask(db, userId, data) {
  const costTON = data.clicks / 250; // pricing rule

  await addDoc(collection(db, "tasks"), {
    creator_id: userId,
    title: data.title,
    link: data.link,
    reward: data.reward,
    clicks_required: data.clicks,
    clicks_done: 0,
    type: "paid",
    budget: costTON,
    status: "active",
    created_at: new Date().toISOString()
  });
}
