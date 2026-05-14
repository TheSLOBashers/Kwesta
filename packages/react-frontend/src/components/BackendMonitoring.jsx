import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
function BackendMonitoring() {

    return (
        <div style={{ background: "#f1f5f9", minHeight: "100vh", padding: "32px" }}>
            <Container fluid>
                {/* HEADER */}
                <Row className="mb-4">
                    <Col>
                        <h1 style={{ fontWeight: "700", color: "#0f172a" }}>
                            Monitor Backend Network Requests
                        </h1>
                        <p style={{ color: "#64748b" }}>
                            Review backend network requests using Grafana
                        </p>
                    </Col>
                </Row>

                <Row className="mb-4">
                    <Col>
                        <Link
                            to="https://slokwesta.grafana.net/goto/afl6xfqk9b6rkb?orgId=stacks-1624627"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            View Backend Network Requests in Grafana
                        </Link>

                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default BackendMonitoring;