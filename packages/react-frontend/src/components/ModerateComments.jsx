// ./Components/ModerateComments.js
import ModerateCommentsTable from "./ModerateCommentsTable";
import { useState, useEffect } from "react";
import moderationFetchUsers from "../APICalls/moderationFetchUsers";
import banUser from "../APICalls/banUser";
import unbanUser from "../APICalls/unbanUser";
import { ThreeDots } from "react-loader-spinner";
import Search from "./Search";

function ModerateComments() {
  const options = [
    { value: "email", label: "email" },
    { value: "username", label: "username" },
    { value: "permissions", label: "permission" }
  ];

  const [comments, setComments] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    moderationFetchUsers(setError, setIsLoading)
      .then((json) => setComments(json["users_list"]))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      <h1>Moderate comments</h1>
      <p>
        Here is where you would manage comments
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
          <Search options = {options} setSearchResults={setSearchResults} items = {comments} />
          <ModerateCommentsTable
            userData={searchResults}
            banUser={banUser}
            unbanUser={unbanUser}
            setUsers={setComments}
          />
        </div>
      )}
      <p style={{ color: "red", fontWeight: "bold" }}>
        {error === "" ? "" : error}
      </p>
    </div>
  );
}

export default ModerateComments;
