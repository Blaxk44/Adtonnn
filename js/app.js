import { getUser } from "./firebase.js";
import { showMonetagAd } from "./ads.js";

const tg = Telegram.WebApp;
tg.expand();
tg.ready();

const user = tg.initDataUnsafe.user;
const uid = String(user.id);

const userRef = await getUser(uid);

setTimeout(() => {
  document.getElementById("splash").style.display = "none";
  document.getElementById("app").classList.remove("hidden");
}, 2000);

document.getElementById("watchAd").onclick = async () => {
  showMonetagAd(userRef, 0);
};
import { getUser, db } from "./firebase.js";
import { showMonetagAd } from "./ads.js";
import { handleReferral, checkReferralReward } from "./referrals.js";
import { getWeekStart } from "./weeklyReset.js";

const tg = Telegram.WebApp;
tg.expand();
tg.ready();

const user = tg.initDataUnsafe.user;
const uid = String(user.id);
const startParam = tg.initDataUnsafe.start_param || null;

const userRef = await getUser(uid);
const snap = await (await import(
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js"
)).getDoc(userRef);

let userData = snap.data();
const currentWeek = getWeekStart();

if (userData.week_start !== currentWeek) {
  await updateDoc(userRef, {
    weekly_ads: 0,
    week_start: currentWeek
  });
}

if (startParam && startParam.startsWith("ref_")) {
  await handleReferral(userRef, userData, startParam.replace("ref_", ""));
}

document.getElementById("watchAd").onclick = async () => {
  await showMonetagAd(userRef, userData.ads_watched);
  await updateDoc(userRef, { weekly_ads: increment(1) });

  const newSnap = await getDoc(userRef);
  userData = newSnap.data();
  await checkReferralReward(userRef, userData, db);
};
import { loadTasks, completeTask } from "./tasks.js";
import { bindWallet, requestWithdrawal } from "./wallet.js";

const tasks = await loadTasks(db);
const taskDiv = document.getElementById("tasks");

tasks.forEach(t => {
  const el = document.createElement("div");
  el.className = "task";
  el.innerHTML = `
    <strong>${t.title}</strong>
    <button>Open</button>
  `;
  el.querySelector("button").onclick = async () => {
    window.open(t.link, "_blank");
    await completeTask(db, t, userRef);
  };
  taskDiv.appendChild(el);
});

document.getElementById("saveWallet").onclick = async () => {
  await bindWallet(userRef, document.getElementById("walletInput").value);
  alert("Wallet saved");
};

document.getElementById("withdrawBtn").onclick = async () => {
  await requestWithdrawal(
    db,
    uid,
    Number(document.getElementById("withdrawAmount").value),
    document.getElementById("walletInput").value
  );
};
