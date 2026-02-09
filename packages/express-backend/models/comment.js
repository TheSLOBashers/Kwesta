import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  { _id: false }
);

const CommentSchema = new mongoose.Schema(
  {
    author: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    comment: { type: String, required: true },
    location: { type: LocationSchema, required: true }
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", CommentSchema);
export default Comment;
