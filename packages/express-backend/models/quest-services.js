import Quest from "./quest.js";

function createQuest(questData) {
  const newQuest = new Quest(questData);
  return newQuest.save();
}

function getQuests() {
  return Quest.find().sort({ createdAt: -1 });
}

function getQuestById(questId) {
  return Quest.findById(questId);
}

async function updateQuest(questId, updateData) {
  return Quest.findByIdAndUpdate(questId, updateData, {
    new: true
  });
}

async function deleteQuest(questId) {
  return Quest.findByIdAndDelete(questId);
}

async function removeQuest(questId) {
  return Quest.findByIdAndUpdate(
    questId,
    { removed: true },
    { new: true }
  );
}

async function unremoveQuest(questId) {
  return Quest.findByIdAndUpdate(
    questId,
    { removed: false },
    { new: true }
  );
}

async function addQuestFlag(questId) {
  return Quest.findByIdAndUpdate(
    questId,
    { $inc: { flag: 1 } },
    { new: true }
  );
}

async function removeQuestFlag(questId) {
  return Quest.findByIdAndUpdate(
    questId,
    { $inc: { flag: -1 } },
    { new: true }
  );
}

/**
 * Search and filter quests with various parameters
 * @param {Object} filters - Filter parameters
 * @param {string} filters.author - Filter by author name
 * @param {string} filters.startDate - Filter quests on or after this date
 * @param {string} filters.endDate - Filter quests on or before this date
 * @param {number} filters.minFlags - Minimum flag count
 * @param {number} filters.maxFlags - Maximum flag count
 * @param {boolean} filters.removed - Filter by removed status
 * @param {string} filters.searchText - Search text in description
 * @param {number} filters.lat - Latitude for location-based search
 * @param {number} filters.lng - Longitude for location-based search
 * @param {number} filters.radius - Radius in kilometers for location search
 * @param {number} filters.minRsvp - Minimum RSVP count
 * @param {number} filters.maxRsvp - Maximum RSVP count
 * @param {string} filters.sortBy - Field to sort by (createdAt, date, flag, rsvpCount)
 * @param {string} filters.sortOrder - Sort order (asc, desc)
 * @param {number} filters.limit - Maximum number of results
 * @param {number} filters.skip - Number of results to skip (pagination)
 */
async function searchQuests(filters = {}) {
  const query = {};

  // Filter by author
  if (filters.author) {
    query.author = { $regex: filters.author, $options: "i" };
  }

  // Filter by date range (event date, not created date)
  if (filters.startDate || filters.endDate) {
    if (filters.startDate && filters.endDate) {
      query.date = {
        $gte: filters.startDate,
        $lte: filters.endDate
      };
    } else if (filters.startDate) {
      query.date = { $gte: filters.startDate };
    } else {
      query.date = { $lte: filters.endDate };
    }
  }

  // Filter by createdAt range
  if (filters.createdAfter || filters.createdBefore) {
    query.createdAt = {};
    if (filters.createdAfter) {
      query.createdAt.$gte = new Date(filters.createdAfter);
    }
    if (filters.createdBefore) {
      query.createdAt.$lte = new Date(filters.createdBefore);
    }
  }

  // Filter by flag count
  if (
    filters.minFlags !== undefined ||
    filters.maxFlags !== undefined
  ) {
    query.flag = {};
    if (filters.minFlags !== undefined) {
      query.flag.$gte = filters.minFlags;
    }
    if (filters.maxFlags !== undefined) {
      query.flag.$lte = filters.maxFlags;
    }
  }

  // Filter by removed status
  if (filters.removed !== undefined) {
    query.removed = filters.removed;
  }

  // Search text in description
  if (filters.searchText) {
    query.description = {
      $regex: filters.searchText,
      $options: "i"
    };
  }

  // Filter by RSVP count
  if (
    filters.minRsvp !== undefined ||
    filters.maxRsvp !== undefined
  ) {
    query.rsvpCount = {};
    if (filters.minRsvp !== undefined) {
      query.rsvpCount.$gte = filters.minRsvp;
    }
    if (filters.maxRsvp !== undefined) {
      query.rsvpCount.$lte = filters.maxRsvp;
    }
  }

  // Location-based filtering (within radius)
  if (
    filters.lat !== undefined &&
    filters.lng !== undefined &&
    filters.radius
  ) {
    const radiusInDegrees = filters.radius / 111; // Approximate conversion
    query["location.lat"] = {
      $gte: filters.lat - radiusInDegrees,
      $lte: filters.lat + radiusInDegrees
    };
    query["location.lng"] = {
      $gte: filters.lng - radiusInDegrees,
      $lte: filters.lng + radiusInDegrees
    };
  }

  // Build sort options
  const sortField = filters.sortBy || "createdAt";
  const sortOrder = filters.sortOrder === "asc" ? 1 : -1;
  const sort = { [sortField]: sortOrder };

  // Build query with pagination
  let queryBuilder = Quest.find(query).sort(sort);

  if (filters.skip) {
    queryBuilder = queryBuilder.skip(filters.skip);
  }

  if (filters.limit) {
    queryBuilder = queryBuilder.limit(filters.limit);
  }

  return queryBuilder.exec();
}

async function getQuestStats() {
  const totalQuests = await Quest.countDocuments();
  const flaggedQuests = await Quest.countDocuments({
    flag: { $gt: 0 }
  });
  const removedQuests = await Quest.countDocuments({
    removed: true
  });

  return {
    total: totalQuests,
    flagged: flaggedQuests,
    removed: removedQuests,
    active: totalQuests - removedQuests
  };
}

export default {
  createQuest,
  getQuests,
  getQuestById,
  updateQuest,
  deleteQuest,
  removeQuest,
  unremoveQuest,
  addQuestFlag,
  removeQuestFlag,
  searchQuests,
  getQuestStats
};
