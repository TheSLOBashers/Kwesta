import React from "react";
import { useState, useEffect } from "react";

import EventOverlay from "./EventOverlay";
import EventOpenButton from "./EventOpenButton";

function Events({ events }) {
  const [eventIsOpen, setEventIsOpen] = useState(false);

  return (
    <div>
      <EventOpenButton
        onClick={() => setEventIsOpen(!eventIsOpen)}
      />

      {eventIsOpen && (
        <EventOverlay
          events={events}
          close={() => setEventIsOpen(false)}
        />
      )}
    </div>
  );
}

export default Events;