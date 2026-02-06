import Mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    UserID: { type: Mongoose.Schema.Types.ObjectId, required: true },
    QuestID: { type: Mongoose.Schema.Types.ObjectId, required: true },
    Content: { type: String, required: true },
    Date: { type: Date, default: Date.now(), immutable: true }
});

const Comment = Mongoose.model("Comment", CommentSchema);
export default Comment;