import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
{
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true }
}, { 
    timestamps: true 
}, {
  collection: 'users_list' // Explicitly specify the collection name
});

const User = mongoose.model("User", UserSchema);
export default User;