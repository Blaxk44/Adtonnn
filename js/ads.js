import { updateDoc, increment } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { calculateReward } from "./rewards.js";

export async function showMonetagAd(userRef, adsWatched) {
  show_10551237().then(async () => {
    const reward = calculateReward(adsWatched);
    await updateDoc(userRef, {
      balance: increment(reward),
      ads_watched: increment(1),
      today_earnings: increment(reward)
    });

    Telegram.WebApp.HapticFeedback.notificationOccurred("success");
    document.getElementById("rewardSound").play();
    alert(`+${reward} TON earned`);
  });
}

