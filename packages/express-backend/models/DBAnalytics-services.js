import DBAnalytics from "./DBAnalytics.js";

async function saveDBAnalytics(analyticName, values) {
  const dbAnalytics = new DBAnalytics({
    analytic: analyticName,
    data: values
  });
  return await dbAnalytics.save();
}

async function addDBAnalytics(analyticName, values) {
  return await DBAnalytics.updateOne(
    { analytic: analyticName },
    { $push: { data: { $each: values } } },
    { upsert: true }
  );
}

async function getDBAnalytics(analyticName) {
  return await DBAnalytics.findOne({ analytic: analyticName });
}

async function getAggregatedAnalytics(analyticName) {
  return DBAnalytics.aggregate([
    // Match the specific analytic
    {
      $match: { analytic: analyticName }
    },

    // Break apart the data array
    {
      $unwind: "$data"
    },

    // Create a 10-minute bucket
    {
      $addFields: {
        bucket: {
          $toDate: {
            $subtract: [
              { $toLong: "$data.timeStamp" },
              {
                $mod: [
                  { $toLong: "$data.timeStamp" },
                  1000 * 60 * 10 // 10 minutes in ms
                ]
              }
            ]
          }
        }
      }
    },

    // Group by bucket and sum values
    {
      $group: {
        _id: "$bucket",
        totalValue: { $sum: "$data.value" }
      }
    },

    // Format output
    {
      $project: {
        _id: 0,
        timeStamp: "$_id",
        value: "$totalValue"
      }
    },

    // Sort chronologically
    {
      $sort: { timeStamp: 1 }
    }
  ]);
}

export { saveDBAnalytics, addDBAnalytics, getDBAnalytics, getAggregatedAnalytics };