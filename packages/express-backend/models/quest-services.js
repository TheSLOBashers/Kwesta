import Quest from "./quest.js";

function createQuest(questData) {
  const newQuest = new Quest(questData);
  return newQuest.save();
}

function getQuests() {
  return Quest.find().sort({ createdAt: -1 });
}

export default {
  createQuest,
  getQuests
};
