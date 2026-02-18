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
    author: { type: Schema.Types.ObjectId, ref: 'users_list', required: true },
    date: { type: Date, required: true, default: Date.now },
    comment: { type: String, required: true },
    location: { type: LocationSchema, required: true }
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", CommentSchema);
export default Comment;
