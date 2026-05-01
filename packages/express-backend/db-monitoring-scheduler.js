import cron from 'node-cron';
import {addDBAnalytics} from './models/DBAnalytics-services.js';
import getClusterUsageStats from './third_party_API_calls/mongo_usage.js';
import mongoose from "mongoose";
import dotenv from "dotenv";

console.log("Starting DB monitoring scheduler...");
dotenv.config();

// Mongo setup
mongoose.set("debug", true);
const mongoUri =
  process.env.MONGO_URI ? process.env.MONGO_URI : "mongodb://localhost:27017/KWESTA";

mongoose
  .connect(mongoUri)
  .then(() => console.log(`MongoDB connected at ${mongoUri}!`))
  .then(() => console.log("Connected DB:", mongoose.connection.name))
  .catch(error => console.log(error));

cron.schedule('*/5 * * * *', () => {
  console.log('Task running every 5 minutes');
  getClusterUsageStats().then((stats) => {
    console.log("Fetched cluster usage stats:", stats);
    stats.forEach(set => { 
        addDBAnalytics(set.name, set.dataPoints.map(dp => ({ timeStamp: dp.timestamp, value: dp.value })));
    });
  });
});
