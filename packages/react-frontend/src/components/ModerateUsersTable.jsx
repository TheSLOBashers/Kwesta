// src/Table.jsx
function TableHeader() {
  return (
    <thead>
      <tr>
        <th>ID</th>
        <th>Username</th>
        <th>Email</th>
        <th>Permissions</th>
      </tr>
    </thead>
  );
}

async function handleBanUser(index, banUser, setUsers) {
  console.log("attempting ban");
  try {
    let editedUser = await banUser(index);
    editedUser = editedUser.user;
    setUsers((prev) =>
      prev.map((user) =>
        user._id === index ? editedUser : user
      )
    );
  } catch {
    window.alert("Error banning user.");
  }
}

async function handleUnbanUser(index, unbanUser, setUsers) {
  try {
    let editedUser = await unbanUser(index);
    editedUser = editedUser.user;
    setUsers((prev) =>
      prev.map((user) =>
        user._id === index ? editedUser : user
      )
    );
  } catch {
    window.alert("Error unbanning user.");
  }
}

function TableBody(props) {
  const rows = props.userData.map((row, index) => {
    return (
      <tr key={index}>
        <td>{row._id}</td>
        <td>{row.username}</td>
        <td>{row.email}</td>
        <td>{row.permissions}</td>
        <td>
          {row.permissions !== "Banned" ? (
            <button
              onClick={() =>
                handleBanUser(row._id, props.banUser, props.setUsers)
              }
            >
              Ban
            </button>
          ) : (
            <button
              onClick={() =>
                handleUnbanUser(row._id, props.unbanUser, props.setUsers)
              }
            >
              Unban
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
        userData={props.userData}
        banUser={props.banUser}
        unbanUser={props.unbanUser}
        setUsers={props.setUsers}
      />
    </table>
  );
}

export default ModerateUsersTable;
