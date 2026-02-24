// ./Components/ModerateComments.js
import ModerateCommentsTable from "./ModerateCommentsTable";
import { useState, useEffect } from "react";
import moderationFetchComments from "../APICalls/moderationFetchComments";
import { ThreeDots } from "react-loader-spinner";
import Search from "./Search";
import removeComment from "../APICalls/removeComment";
import unremoveComment from "../APICalls/unremoveComment";

function ModerateComments() {
  const options = [
    { value: "_id", label: "ID", type: "string" },
    { value: "author", label: "Author", type: "string" },
    { value: "comment", label: "Comment", type: "string" },
    { value: "flag", label: "Flag", type: "number" },
    { value: "date", label: "Date", type: "date" }
  ];

  const [comments, setComments] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    moderationFetchComments(setError, setIsLoading)
      .then((json) => setComments(json["comments"]))
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
            commentsData={searchResults}
            setComments={setComments}
            removeComment={removeComment}
            unremoveComment={unremoveComment}
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
