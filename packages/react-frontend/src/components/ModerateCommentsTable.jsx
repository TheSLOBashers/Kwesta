// src/Table.jsx
function TableHeader() {
  return (
    <thead>
      <tr>
        <th>ID</th>
        <th>Author</th>
        <th>Comment</th>
        <th>Flags</th>
        <th>Date</th>
      </tr>
    </thead>
  );
}

async function handleRemoveComment(index, removeComment, setComments) {
  console.log("attempting remove comment");
  try {
    let editedComment = await removeComment(index);
    editedComment = editedComment.comment;
    setComments((prev) =>
      prev.map((comment) =>
        comment._id === index ? editedComment : comment
      )
    );
  } catch {
    window.alert("Error removing comment.");
  }
}

async function handleUnremoveComment(index, unremoveComment, setComments) {
  console.log("attempting unremove comment");
  try {
    let editedComment = await unremoveComment(index);
    editedComment = editedComment.comment;
    setComments((prev) =>
      prev.map((comment) =>
        comment._id === index ? editedComment : comment
      )
    );
  } catch {
    window.alert("Error unremoving comment.");
  }
}

function TableBody(props) {
  const rows = props.commentsData.map((row, index) => {
    return (
      <tr key={index}>
        <td>{row._id}</td>
        <td>{row.author.username}</td>
        <td>{row.comment}</td>
        <td>{row.flag}</td>
        <td>{row.date}</td>
        <td>
          {row.removed === false ? (
            <button
              onClick={() =>
                handleRemoveComment(row._id, props.removeComment, props.setComments)
              }
            >
              Remove
            </button>
          ) : (
            <button
              onClick={() =>
                handleUnremoveComment(row._id, props.unremoveComment, props.setComments)
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

function ModerateUsersTable(props) {
  return (
    <table>
      <TableHeader />
      <TableBody
        commentsData={props.commentsData}
        setComments={props.setComments}
        removeComment={props.removeComment}
        unremoveComment={props.unremoveComment}
      />
    </table>
  );
}

export default ModerateUsersTable;
