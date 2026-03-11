import mongoose from "mongoose";
const { Schema } = mongoose;

const LocationSchema = new mongoose.Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  { _id: false }
);

const CommentSchema = new mongoose.Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    date: { type: Date, required: true, default: Date.now },
    comment: { type: String, required: true },
    location: { type: LocationSchema, required: true },
    flag: { type: Number, default: 0, required: true },
    likes: { type: Number, default: 0, required: true },
    likedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    removed: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", CommentSchema);
export default Comment;
