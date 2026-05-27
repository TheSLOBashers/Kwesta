import mongoose from "mongoose";
import validator from "validator";
const { Schema } = mongoose;

const ProfilePhotoSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        filename: String,
        contentType: String,
        image: Buffer,
        size: Number,
        createdAt: { type: Date, default: Date.now }
    }
);

const ProfilePhoto = mongoose.model("ProfilePhoto", ProfilePhotoSchema);
export default ProfilePhoto;