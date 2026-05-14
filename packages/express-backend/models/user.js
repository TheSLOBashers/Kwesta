import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    permissions: {
      type: String,
      required: true,
      default: "regular"
    },
    points: { type: Number, default: 0 },
    blockList: [
      {
        user: { type: Schema.Types.ObjectId, ref: "users_list" }
      }
    ],
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    flagList: [
      {
        comment: { type: Schema.Types.ObjectId, ref: "Comment" }
      }
    ],
    devices: [
      {
        device: { type: Object },
        allowed: { type: Boolean },
        device_brand: { type: String, null: true },
        device_designName: { type: String, null: true },
        device_deviceName: { type: String, null: true },
        device_deviceYearClass: { type: String, null: true },
        device_deviceType: { type: String, null: true }
      }
    ]
  },
  {
    timestamps: true
  },
  {
    collection: "users_list" // Explicitly specify the collection name
  }
);

const User = mongoose.model("User", UserSchema);
export default User;
