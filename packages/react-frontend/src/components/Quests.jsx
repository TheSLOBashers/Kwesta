import React from "react";
import { useState, useEffect } from "react";

import QuestOverlay from "./QuestOverlay";
import QuestOpenButton from "./QuestOpenButton";

function Events({ quests, setQuests }) {
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
          close={() => setQuestIsOpen(false)}
        />
      )}
    </div>
  );
}

export default Events;