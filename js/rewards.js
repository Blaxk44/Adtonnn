export function calculateReward(adsWatched) {
  if (adsWatched < 400) return 0.005;
  if (adsWatched < 1000) return 0.007;
  return 0.008;
}
