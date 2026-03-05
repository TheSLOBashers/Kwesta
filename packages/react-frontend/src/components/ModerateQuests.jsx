// ./Components/ModerateQuests.js
import ModerateQuestsTable from "./ModerateQuestsTable";
import { useState, useEffect } from "react";
import moderationFetchQuests from "../APICalls/moderationFetchQuests";
import { ThreeDots } from "react-loader-spinner";
import Search from "./Search";
import removeQuest from "../APICalls/removeQuest";
import unremoveQuest from "../APICalls/unremoveQuest";

function ModerateQuests() {
  const options = [
    { value: "_id", label: "ID", type: "string" },
    { value: "author", label: "Author", type: "string" },
    { value: "date", label: "Date", type: "date" },
    { value: "time", label: "Time", type: "string" },
    {
      value: "description",
      label: "Description",
      type: "string"
    },
    { value: "points", label: "Points", type: "number" },
    { value: "flag", label: "Flag", type: "number" }
  ];

  const searchOptions = [
    {
      value: "author",
      label: "Author",
      type: "text"
    },
    {
      value: "startDate",
      label: "Start Date",
      type: "date"
    },
    {
      value: "endDate",
      label: "End Date",
      type: "date"
    },
    {
      value: "createdAfter",
      label: "Created After",
      type: "date"
    },
    {
      value: "createdBefore",
      label: "Created Before",
      type: "date"
    }
  ];

  const [searchParams, setSearchParams] = useState({});

  const [quests, setQuests] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    moderationFetchQuests(setError, setIsLoading, searchParams)
      .then((json) => setQuests(json["quests"]))
      .catch((error) => {
        console.log(error);
      });
  }, [searchParams]);

  return (
    <div>
      <h1>Moderate quests</h1>
      <p>Here is where you would manage quests</p>
      {isLoading ? (
        <ThreeDots
          height="40"
          width="40"
          color="#000000"
          visible={isLoading}
        />
      ) : (
        <div>
          <form>
            <label htmlFor="searchOptions">Search by: </label>
            {searchOptions.map((option) => (
              <div key={option.value}>
                <label htmlFor={option.value}>
                  {option.label}:{" "}
                </label>
                <input
                  type={option.type}
                  id={option.value}
                  value={searchParams[option.value] || ""}
                  onChange={(e) =>
                    setSearchParams({
                      ...searchParams,
                      [option.value]: e.target.value
                    })
                  }
                />
              </div>
            ))}
          </form>

          <Search
            options={options}
            setSearchResults={setSearchResults}
            items={quests}
          />
          <ModerateQuestsTable
            questsData={searchResults}
            setQuests={setQuests}
            removeQuest={removeQuest}
            unremoveQuest={unremoveQuest}
          />
        </div>
      )}
      <p style={{ color: "red", fontWeight: "bold" }}>
        {error === "" ? "" : error}
      </p>
    </div>
  );
}

export default ModerateQuests;
