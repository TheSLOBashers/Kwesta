import mongoose from "mongoose";
const Schema = mongoose.Schema;

const LocationSchema = new mongoose.Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  { _id: false }
);

const EventSchema = new mongoose.Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: LocationSchema, required: true },
    rsvpCount: { type: Number, default: 0 },
    image: { type: String, required: false },
    flag: { type: Number, default: 0 },
    removed: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", EventSchema);
export default Event;
