// components/ModerationPortal.jsx
import PortalButton from "./PortalButton";
import Dash_option from "./Dash_option";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import BackendStatusCard from "./BackendStatusCard";

function MonitoringPortal() {

  return (
    <div style={{ background: "#f1f5f9", minHeight: "100vh", padding: "32px" }}>
      <Container fluid>
        {/* HEADER */}
        <Row className="mb-4">
          <Col>
            <h1 style={{ fontWeight: "700", color: "#0f172a" }}>
              Monitoring Portal
            </h1>
            <p style={{ color: "#64748b" }}>
              Monitor backend and database network requests
            </p>
          </Col>
        </Row>


        <Row>
            <BackendStatusCard width={"90%"}></BackendStatusCard>
            <Dash_option title={"Monitor DB Network Requests"} options={[
              { text: "View Network Requests", link: "/monitoring/db-network-requests" }, 
              { text: "View Operation Counter Commands", link: "/monitoring/OPCOUNTER_CMD" },
              { text: "View Operation Counter Update", link: "/monitoring/db-opcounter-update" },
              { text: "View Operation Counter Delete", link: "/monitoring/db-opcounter-delete" },
              { text: "View Operation Counter Insert", link: "/monitoring/db-opcounter-insert" },
              { text: "View DB Connections", link: "/monitoring/db-connections"}
            ]} width={"90%"}></Dash_option>
            <Dash_option title={"Monitor Backend Network Requests"} options={[
              { text: "View Network Requests", link: "/monitoring/Grafana" }
            ]} width={"90%"}></Dash_option>
        </Row>

      </Container>
    </div>

  );
} // monitoring/Grafana

export default MonitoringPortal;