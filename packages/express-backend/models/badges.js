import mongoose from "mongoose";
import validator from "validator";
const { Schema } = mongoose;
import { Buffer } from "buffer";

const BadgeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    cost: { type: Number, required: true },
    contentType: { type: String, required: true },
    icon: { type: Buffer, required: true }
  },
  {
    timestamps: true
  }
);

const Badge = mongoose.model("Badge", BadgeSchema);
export default Badge;