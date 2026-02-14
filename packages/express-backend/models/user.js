import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new mongoose.Schema(
{
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    permissions: { type: String, required: true, default: "regular" },
    blockList: [{
        user: { type: Schema.Types.ObjectId, ref: 'users_list' }
    }]
}, { 
    timestamps: true 
}, {
  collection: 'users_list' // Explicitly specify the collection name
});

const User = mongoose.model("User", UserSchema);
export default User;