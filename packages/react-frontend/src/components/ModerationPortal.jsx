// components/ModerationPortal.jsx
import PortalButton from "./PortalButton";
import Dash_option from "./Dash_option";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import BackendStatusCard from "./BackendStatusCard";

function ModerationPortal() {

  return (
    <div style={{ background: "#f1f5f9", minHeight: "100vh", padding: "32px" }}>
      <Container fluid>
        {/* HEADER */}
        <Row className="mb-4">
          <Col>
            <h1 style={{ fontWeight: "700", color: "#0f172a" }}>
              Moderation Portal
            </h1>
            <p style={{ color: "#64748b" }}>
              Manage users, comments, quests, and monitor database network requests
            </p>
          </Col>
        </Row>


        <Row>
            <Dash_option title={"Manage users"} options={[{ text: "Moderate users", link: "/moderation/users" }]} width={"90%"}></Dash_option>
            <Dash_option title={"Manage comments"} options={[{ text: "Moderate comments", link: "/moderation/comments" }, { text: "Add Comment", link: "/moderation/add-comment" }]} width={"90%"}></Dash_option>
            <Dash_option title={"Manage quests"} options={[{ text: "Moderate quests", link: "/moderation/quests" }, { text: "Add Quest", link: "/moderation/add-quest" }]} width={"90%"}></Dash_option>
            <Dash_option title={"Monitor DB Network Requests"} options={[
              { text: "View Network Requests", link: "/monitoring/db-network-requests" }, 
              { text: "View Operation Counter Commands", link: "/monitoring/OPCOUNTER_CMD" },
              { text: "View Operation Counter Update", link: "/monitoring/db-opcounter-update" },
              { text: "View Operation Counter Delete", link: "/monitoring/db-opcounter-delete" },
              { text: "View Operation Counter Insert", link: "/monitoring/db-opcounter-insert" },
              { text: "View DB Connections", link: "/monitoring/db-connections"}
            ]} width={"90%"}></Dash_option>
            <BackendStatusCard width={"90%"}></BackendStatusCard>
        </Row>

      </Container>
    </div>

  );
}

/*
{ text: "View FTS Process CPU Kernel", link: "/monitoring/FTS_PROCESS_CPU_KERNEL" }, 
              { text: "View FTS Process Resident Memory", link: "/monitoring/FTS_PROCESS_RESIDENT_MEMORY" }, 
              { text: "View FTS Disk Usage", link: "/monitoring/FTS_DISK_USAGE" }, 
               */

/*
<div style={{ display: "flex", flexDirection: "column", gap: "20px", position: "sticky", top: "24px" }}>

          <div style={cardStyle}>
            <h6 style={{ fontWeight: "600", marginBottom: "12px", color: "#0f172a" }}>
              Quick Search
            </h6>

            <Search
              options={[
                { value: "timestamp", label: "Timestamp", type: "date" },
                { value: "value", label: "Value", type: "number" },
              ]}
              setSearchResults={setSearchResults}
              items={data}
            />
          </div>

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
*/
export default ModerationPortal;
