import {
  updateDoc, addDoc, collection, doc
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

export async function bindWallet(userRef, address) {
  await updateDoc(userRef, {
    wallet_address: address
  });
}

export function calculateWithdrawal(amount) {
  const fee = amount * 0.20;
  return {
    fee,
    net: amount - fee
  };
}

export async function requestWithdrawal(db, userId, amount, wallet) {
  const { fee, net } = calculateWithdrawal(amount);

  if (amount < 2) {
    alert("Minimum withdrawal is 2 TON");
    return;
  }

  await addDoc(collection(db, "withdrawals"), {
    user_id: userId,
    amount,
    fee,
    net_amount: net,
    wallet_address: wallet,
    status: "pending",
    requested_at: new Date().toISOString()
  });
}
