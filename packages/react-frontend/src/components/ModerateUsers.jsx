// components/ModerateUsers.jsx
import ModerateUsersTable from "./ModerateUsersTable";
import { useState, useEffect } from "react";
import moderationFetchUsers from "../APICalls/moderationFetchUsers";
import banUser from "../APICalls/banUser";
import unbanUser from "../APICalls/unbanUser";
import { ThreeDots } from "react-loader-spinner";
import SearchBar from "./searchBar";

function ModerateUsers() {
  const options = [
    { value: "email", label: "email" },
    { value: "username", label: "username" },
    { value: "permissions", label: "permission" }
  ];

  const [users, setUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchColumn, setSearchColumn] = useState(
    options[0].value
  );

  const handleChange = (event) => {
    setSearchColumn(event.target.value);
  };

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
        <div>
          <div>
            <label htmlFor="search-select">
              Choose a search column:
            </label>
            <select
              id="search-select"
              value={searchColumn}
              onChange={handleChange}
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <SearchBar
            setSearchResults={setSearchResults}
            searchColumn={searchColumn}
            items={users}
          />
          <ModerateUsersTable
            userData={searchResults}
            banUser={banUser}
            unbanUser={unbanUser}
            setUsers={setUsers}
          />
        </div>
      )}
      <p style={{ color: "red", fontWeight: "bold" }}>
        {error === "" ? "" : error}
      </p>
    </div>
  );
}

export default ModerateUsers;
