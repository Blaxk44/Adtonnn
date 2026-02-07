import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

export async function loadLeaderboard(db) {
  const q = query(
    collection(db, "users"),
    where("weekly_ads", ">=", 1000),
    orderBy("weekly_ads", "desc"),
    limit(50)
  );

  const snap = await getDocs(q);
  return snap.docs.map((doc, i) => ({
    rank: i + 1,
    ...doc.data()
  }));
}
