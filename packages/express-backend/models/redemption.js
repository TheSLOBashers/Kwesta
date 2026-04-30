import mongoose from "mongoose";
const { Schema } = mongoose;

const RedemptionSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    rewardName: { type: String, required: true },
    pointsRedeemed: { type: Number, required: true },
    redeemedAt: { type: Date, default: Date.now },
    status: { type: String, default: "completed" },
    // optional metadata payload from client/backend
    meta: { type: Schema.Types.Mixed }
  },
  {
    timestamps: true
  }
);

const Redemption = mongoose.model(
  "Redemption",
  RedemptionSchema
);
export default Redemption;
