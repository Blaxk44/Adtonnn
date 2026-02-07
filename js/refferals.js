import { doc, updateDoc, increment } from
"https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

export async function handleReferral(userRef, userData, referrerId) {
  if (userData.referred_by || !referrerId) return;

  await updateDoc(userRef, {
    referred_by: referrerId
  });
}

export async function checkReferralReward(userRef, userData, db) {
  if (
    !userData.referred_by ||
    userData.referral_rewarded ||
    userData.ads_watched < 50
  ) return;

  const referrerRef = doc(db, "users", userData.referred_by);

  await updateDoc(referrerRef, {
    balance: increment(0.005),
    referral_earnings: increment(0.005)
  });

  await updateDoc(userRef, {
    referral_rewarded: true
  });
}
