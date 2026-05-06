import ModerateQuestsTable from "./ModerateQuestsTable";
import { useState, useEffect } from "react";
import moderationFetchQuests from "../APICalls/moderationFetchQuests";
import { ThreeDots } from "react-loader-spinner";
import Search from "./Search";
import removeQuest from "../APICalls/removeQuest";
import unremoveQuest from "../APICalls/unremoveQuest";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import BackButton from "./BackButton";

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
    },
    {
      value: "lat",
      label: "Latitude",
      type: "number"
    },
    {
      value: "lng",
      label: "Longitude",
      type: "number"
    },
    {
      value: "radius",
      label: "Radius",
      type: "number"
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

  const cardStyle = {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.06)"
  };

  return (
    <div style={{ background: "#f1f5f9", minHeight: "100vh", padding: "32px" }}>
      <Container fluid>
        {/* HEADER */}
        <Row className="mb-4">
          <Col>
            <BackButton />
            <h1 style={{ fontWeight: "700", color: "#0f172a", marginTop: "16px" }}>
              Quest Moderation Portal
            </h1>
            <p style={{ color: "#64748b" }}>
              Review, filter, and manage user quests
            </p>
          </Col>
        </Row>

        {/* SPLIT LAYOUT */}
        <div style={{ display: "flex", flexDirection: "row", gap: "24px", alignItems: "flex-start" }}>
          {/* LEFT: OUTPUT CARD */}
          <div style={{ flex: 2 }}>
            <div style={{ ...cardStyle, height: "100%" }}>
              <h5 style={{ fontWeight: "600", marginBottom: "16px", color: "#0f172a" }}>
                Quests
              </h5>

              {isLoading ? (
                <div className="d-flex justify-content-center py-5">
                  <ThreeDots height="60" width="60" color="#0ea5e9" visible />
                </div>
              ) : (
                <ModerateQuestsTable
                  questsData={searchResults.length ? searchResults : quests}
                  setQuests={setQuests}
                  removeQuest={removeQuest}
                  unremoveQuest={unremoveQuest}
                />
              )}
            </div>
          </div>

          {/* RIGHT: STACKED SEARCH CARDS */}
          <div style={{ flex: 1, minWidth: "320px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px", position: "sticky", top: "24px" }}>

              {/* QUICK SEARCH CARD */}
              <div style={cardStyle}>
                <h6 style={{ fontWeight: "600", marginBottom: "12px", color: "#0f172a" }}>
                  Quick Search
                </h6>

                <Search
                  options={options}
                  setSearchResults={setSearchResults}
                  items={quests}
                />
              </div>

              {/* SEARCH PARAMS CARD */}
              <div style={cardStyle}>
                <h6 style={{ fontWeight: "600", marginBottom: "12px", color: "#0f172a" }}>
                  Advanced Filters
                </h6>

                <Form>
                  {searchOptions.map((option) => (
                    <Form.Group key={option.value} className="mb-3">
                      <Form.Label style={{ color: "#475569", fontSize: "14px" }}>
                        {option.label}
                      </Form.Label>
                      <Form.Control
                        type={option.type}
                        value={searchParams[option.value] || ""}
                        onChange={(e) =>
                          setSearchParams({
                            ...searchParams,
                            [option.value]: e.target.value
                          })
                        }
                        style={{
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px"
                        }}
                      />
                    </Form.Group>
                  ))}

                  <Button
                    style={{
                      width: "100%",
                      background: "#0ea5e9",
                      border: "none",
                      fontWeight: "600",
                      borderRadius: "8px"
                    }}
                    onClick={() => setSearchParams({})}
                  >
                    Reset Filters
                  </Button>
                </Form>
              </div>

            </div>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <Row className="mt-3">
            <Col>
              <p style={{ color: "#dc2626", fontWeight: "600" }}>
                {error}
              </p>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
}

export default ModerateQuests;


/*
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
  const [openSearch, setOpenSearch] = useState(false);

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
          {openSearch ? (
            <form>
              <button onClick={() => setOpenSearch(false)}>
                Close Search
              </button>
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
          ) : (
            <button onClick={() => setOpenSearch(true)}>
              Open Search
            </button>
          )}

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
*/