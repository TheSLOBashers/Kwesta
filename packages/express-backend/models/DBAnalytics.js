import mongoose from "mongoose";
const { Schema } = mongoose;

const DBAnalyticsSchema = new mongoose.Schema(
  {
    analytic: { type: String, required: true, unique: true },
    data: [{ timeStamp: { type: Date }, value: { type: Number } }]
  },
  {
    timestamps: true
  },
  {
    collection: "db_analytics" // Explicitly specify the collection name
  }
);

const DBAnalytics = mongoose.model("DBAnalytics", DBAnalyticsSchema);
export default DBAnalytics;
