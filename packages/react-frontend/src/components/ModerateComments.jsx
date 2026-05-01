import ModerateCommentsTable from "./ModerateCommentsTable";
import { useState, useEffect } from "react";
import moderationFetchComments from "../APICalls/moderationFetchComments";
import { ThreeDots } from "react-loader-spinner";
import Search from "./Search";
import removeComment from "../APICalls/removeComment";
import unremoveComment from "../APICalls/unremoveComment";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

function ModerateComments() {
  const searchOptions = [
    { value: "username", label: "Author", type: "text" },
    { value: "startDate", label: "Start Date", type: "date" },
    { value: "endDate", label: "End Date", type: "date" },
    { value: "minFlags", label: "Min Flags", type: "number" },
    { value: "maxFlags", label: "Max Flags", type: "number" }
  ];

  const [searchParams, setSearchParams] = useState({});
  const [comments, setComments] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    moderationFetchComments(setError, setIsLoading, searchParams)
      .then((json) => setComments(json["comments"]))
      .catch((error) => console.log(error));
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
            <h1 style={{ fontWeight: "700", color: "#0f172a" }}>
              Comment Moderation Portal
            </h1>
            <p style={{ color: "#64748b" }}>
              Review, filter, and manage user comments
            </p>
          </Col>
        </Row>

        {/* SPLIT LAYOUT */}
        <div style={{ display: "flex", flexDirection: "row", gap: "24px", alignItems: "flex-start" }}>
          {/* LEFT: OUTPUT CARD */}
          <div style={{ flex: 2 }}>
            <div style={{ ...cardStyle, height: "100%" }}>
              <h5 style={{ fontWeight: "600", marginBottom: "16px", color: "#0f172a" }}>
                Comments
              </h5>

              {isLoading ? (
                <div className="d-flex justify-content-center py-5">
                  <ThreeDots height="60" width="60" color="#0ea5e9" visible />
                </div>
              ) : (
                <ModerateCommentsTable
                  commentsData={searchResults.length ? searchResults : comments}
                  setComments={setComments}
                  removeComment={removeComment}
                  unremoveComment={unremoveComment}
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
                  options={[
                    { value: "_id", label: "ID", type: "string" },
                    { value: "author", label: "Author", type: "string" },
                    { value: "comment", label: "Comment", type: "string" },
                    { value: "flag", label: "Flag", type: "number" },
                    { value: "date", label: "Date", type: "date" }
                  ]}
                  setSearchResults={setSearchResults}
                  items={comments}
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

export default ModerateComments;