// src/Table.jsx
function TableHeader() {
  return (
    <thead>
      <tr>
        <th>Author</th>
        <th>Date</th>
        <th>Time</th>
        <th>Description</th>
        <th>Flags</th> 
      </tr>
    </thead>
  );
}

async function handleRemoveEvent(index, removeEvent, setEvents) {
  console.log("attempting remove event");
  try {
    let editedEvent = await removeEvent(index);
    editedEvent = editedEvent.event;
    setEvents((prev) =>
      prev.map((event) =>
        event._id === index ? editedEvent : event
      )
    );
  } catch {
    window.alert("Error removing event.");
  }
}

async function handleUnremoveEvent(index, unremoveEvent, setEvents) {
  console.log("attempting unremove event");
  try {
    let editedEvent = await unremoveEvent(index);
    editedEvent = editedEvent.event;
    setEvents((prev) =>
      prev.map((event) =>
        event._id === index ? editedEvent : event
      )
    );
  } catch {
    window.alert("Error unremoving event.");
  }
}

function TableBody(props) {
  const rows = props.eventsData.map((row, index) => {
    return (
      <tr key={index}>
        <td>{row.author}</td>
        <td>{row.date}</td>
        <td>{row.time}</td>
        <td>{row.description}</td>
        <td>{row.flag}</td>
        <td>
          {row.removed === false ? (
            <button
              onClick={() =>
                handleRemoveEvent(row._id, props.removeEvent, props.setEvents)
              }
            >
              Remove
            </button>
          ) : (
            <button
              onClick={() =>
                handleUnremoveEvent(row._id, props.unremoveEvent, props.setEvents)
              }
            >
              Unremove
            </button>
          )}
        </td>
      </tr>
    );
  });
  return <tbody>{rows}</tbody>;
}

function ModerateEventsTable(props) {
  return (
    <table>
      <TableHeader />
      <TableBody
        eventsData={props.eventsData}
        setEvents={props.setEvents}
        removeEvent={props.removeEvent}
        unremoveEvent={props.unremoveEvent}
      />
    </table>
  );
}

export default ModerateEventsTable;
