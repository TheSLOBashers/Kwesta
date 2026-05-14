// components/ModerateUsers.jsx
import ModerateUsersTable from "./ModerateUsersTable";
import { useState, useEffect } from "react";
import moderationFetchUsers from "../APICalls/moderationFetchUsers";
import banUser from "../APICalls/banUser";
import unbanUser from "../APICalls/unbanUser";
import { ThreeDots } from "react-loader-spinner";
import Search from "./Search";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import BackButton from "./BackButton";

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

  useEffect(() => {
    moderationFetchUsers(setError, setIsLoading)
      .then((json) => setUsers(json["users_list"]))
      .catch((error) => {
        console.log(error);
      });
  }, []);

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
              User Moderation Portal
            </h1>
            <p style={{ color: "#64748b" }}>
              Review, filter, and manage users

            </p>
          </Col>
        </Row>

        {/* SPLIT LAYOUT */}
        <div style={{ display: "flex", flexDirection: "row", gap: "24px", alignItems: "flex-start" }}>
          {/* LEFT: OUTPUT CARD */}
          <div style={{ flex: 2 }}>
            <div style={{ ...cardStyle, height: "100%" }}>
              <h5 style={{ fontWeight: "600", marginBottom: "16px", color: "#0f172a" }}>
                Users
              </h5>

              {isLoading ? (
                <div className="d-flex justify-content-center py-5">
                  <ThreeDots height="60" width="60" color="#0ea5e9" visible />
                </div>
              ) : (
                <ModerateUsersTable
                  userData={searchResults}
                  banUser={banUser}
                  unbanUser={unbanUser}
                  setUsers={setUsers}
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
                  items={users}
                />
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

export default ModerateUsers;
/*
import ModerateUsersTable from "./ModerateUsersTable";
import { useState, useEffect } from "react";
import moderationFetchUsers from "../APICalls/moderationFetchUsers";
import banUser from "../APICalls/banUser";
import unbanUser from "../APICalls/unbanUser";
import { ThreeDots } from "react-loader-spinner";
import Search from "./Search";

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
          <Search options = {options} setSearchResults={setSearchResults} items = {users} />
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
*/