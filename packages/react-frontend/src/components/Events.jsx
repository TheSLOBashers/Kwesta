import React from "react";
import { useState, useEffect } from "react";

import EventOverlay from "./EventOverlay";
import EventOpenButton from "./EventOpenButton";

function Events({ events, setEvents, onPointsChanged }) {
  const [eventIsOpen, setEventIsOpen] = useState(false);

  return (
    <div>
      <EventOpenButton
        onClick={() => setEventIsOpen(!eventIsOpen)}
      />

      {eventIsOpen && (
        <EventOverlay
          events={events}
          setEvents={setEvents}
          onPointsChanged={onPointsChanged}
          close={() => setEventIsOpen(false)}
        />
      )}
    </div>
  );
}

export default Events;