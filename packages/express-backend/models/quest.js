import Mongoose from "mongoose";

const QuestSchema = new Mongoose.Schema({
    Title: { type: String, required: true },
    Description: { type: String, required: true },
    UserID: { type: Mongoose.Schema.Types.ObjectId, required: true },
    Created: { type: Date, default: Date.now() },
    Start: { type: Date, required: true },
    End: { type: Date, required: true },
    Coordinate: { type: [Number, Number] } // long + lat location
});

const Quest = Mongoose.model("Quest", QuestSchema);
export default Quest;