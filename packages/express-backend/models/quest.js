import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  { _id: false }
);

const QuestSchema = new mongoose.Schema(
  {
    author: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: LocationSchema, required: true },
    rsvpCount: { type: Number, default: 0 },
    image: { type: String, required: true }
  },
  { timestamps: true }
);

const Quest = mongoose.model("Quest", QuestSchema);
export default Quest;
