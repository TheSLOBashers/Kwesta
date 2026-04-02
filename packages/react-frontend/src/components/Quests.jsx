import React from "react";
import { useState, useEffect } from "react";

import QuestOverlay from "./QuestOverlay";
import QuestOpenButton from "./QuestOpenButton";

function Events({ quests, setQuests, onPointsChanged, onSelectQuest }) {
  const [questIsOpen, setQuestIsOpen] = useState(false);

  return (
    <div>
      <QuestOpenButton
        onClick={() => setQuestIsOpen(!questIsOpen)}
      />

      {questIsOpen && (
        <QuestOverlay
          setQuests={setQuests}
          quests={quests}
          onPointsChanged={onPointsChanged}
          onSelectQuest={onSelectQuest}
          close={() => setQuestIsOpen(false)}
        />
      )}
    </div>
  );
}

export default Events;
