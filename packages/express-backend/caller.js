import mongoUsage from './third_party_API_calls/mongo_usage.js';
const { getClusterUsageStats, getClusterUsageTypes } = mongoUsage;
getClusterUsageTypes().then(types => {
    console.log("Cluster usage types:", types);
});