import React from "react";
import { useState, useEffect } from "react";

import QuestOverlay from "./QuestOverlay";
import QuestOpenButton from "./QuestOpenButton";

function Events({ quests, setQuests, onPointsChanged }) {
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
          close={() => setQuestIsOpen(false)}
        />
      )}
    </div>
  );
}

export default Events;
