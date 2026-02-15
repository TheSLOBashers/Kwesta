// components/ModerateUsers.jsx
import ModerateUsersTable from "./ModerateUsersTable";
import { useState, useEffect } from "react";
import moderationFetchUsers from "../APICalls/moderationFetchUsers";
import banUser from "../APICalls/banUser";
import unbanUser from "../APICalls/unbanUser";
import { ThreeDots } from "react-loader-spinner";

function ModerateUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    moderationFetchUsers(setError, setIsLoading)
      .then((json) => setUsers(json["users_list"]))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      <h1>Moderate Users</h1>
      <p>
        Here is where you would manage user details, ban users,
        etc
      </p>
      {isLoading ? (
        <ThreeDots
          height="40"
          width="40"
          color="#000000"
          visible={isLoading}
        />
      ) : (
        <ModerateUsersTable
          userData={users}
          banUser={banUser}
          unbanUser={unbanUser}
          setUsers={setUsers}
        />
      )}
      <p style={{ color: "red", fontWeight: "bold" }}>
        {error === "" ? "" : error}
      </p>
    </div>
  );
}

export default ModerateUsers;
