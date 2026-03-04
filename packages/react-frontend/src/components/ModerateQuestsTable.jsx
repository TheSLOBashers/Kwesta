// src/Table.jsx
function TableHeader() {
  return (
    <thead>
      <tr>
        <th>ID</th>
        <th>Author</th>
        <th>Date</th>
        <th>Time</th>
        <th>Description</th>
        <th>Points</th>
        <th>Flags</th> 
      </tr>
    </thead>
  );
}

async function handleRemoveQuest(index, removeQuest, setQuests) {
  console.log("attempting remove quest");
  try {
    let editedQuest = await removeQuest(index);
    editedQuest = editedQuest.quest;
    setQuests((prev) =>
      prev.map((quest) =>
        quest._id === index ? editedQuest : quest
      )
    );
  } catch {
    window.alert("Error removing quest.");
  }
}

async function handleUnremoveQuest(index, unremoveQuest, setQuests) {
  console.log("attempting unremove quest");
  try {
    let editedQuest = await unremoveQuest(index);
    editedQuest = editedQuest.quest;
    setQuests((prev) =>
      prev.map((quest) =>
        quest._id === index ? editedQuest : quest
      )
    );
  } catch {
    window.alert("Error unremoving quest.");
  }
}

function TableBody(props) {
  const rows = props.questsData.map((row, index) => {
    return (
      <tr key={index}>
        <td>{row._id}</td>
        <td>{row.author}</td>
        <td>{row.date}</td>
        <td>{row.time}</td>
        <td>{row.description}</td>
        <td>{row.points}</td>
        <td>{row.flag}</td>
        <td>
          {row.removed === false ? (
            <button
              onClick={() =>
                handleRemoveQuest(row._id, props.removeQuest, props.setQuests)
              }
            >
              Remove
            </button>
          ) : (
            <button
              onClick={() =>
                handleUnremoveQuest(row._id, props.unremoveQuest, props.setQuests)
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

function ModerateQuestsTable(props) {
  return (
    <table>
      <TableHeader />
      <TableBody
        questsData={props.questsData}
        setQuests={props.setQuests}
        removeQuest={props.removeQuest}
        unremoveQuest={props.unremoveQuest}
      />
    </table>
  );
}

export default ModerateQuestsTable;
