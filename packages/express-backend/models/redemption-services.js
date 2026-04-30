import Redemption from "./redemption.js";

async function createRedemption(redemptionData) {
  const r = new Redemption(redemptionData);
  return r.save();
}

async function getRedemptionsByUser(
  userId,
  { limit, skip } = {}
) {
  let q = Redemption.find({ user: userId }).sort({
    redeemedAt: -1
  });

  if (skip) q = q.skip(skip);
  if (limit) q = q.limit(limit);

  return q.exec();
}

export default {
  createRedemption,
  getRedemptionsByUser
};
