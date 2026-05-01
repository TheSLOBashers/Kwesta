import { useState, useEffect } from "react";
import moderationFetchComments from "../APICalls/moderationFetchComments";
import monitoringFetchDBData from "../APICalls/monitoringFetchDBData";
import { ThreeDots } from "react-loader-spinner";
import Search from "./Search";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import {
    ScatterChart, Scatter, XAxis,
    YAxis, CartesianGrid, Tooltip
} from 'recharts';

function MonitorDBNetworkRequests() {
    const searchOptions = [
        { value: "startDate", label: "Start Date", type: "date" },
        { value: "endDate", label: "End Date", type: "date" },
    ];

    const [searchParams, setSearchParams] = useState({});
    const [data, setData] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        monitoringFetchDBData(setError, setIsLoading, "NETWORK_NUM_REQUESTS")
            .then((json) => setData(json.measurements.map((dataPoint) => ({
                timestamp: new Date(dataPoint.timeStamp).getTime(), // Convert timestamp to Date object
                value: dataPoint.value
            }))))
            .catch((error) => console.log(error));
    }, [searchParams]);

    const cardStyle = {
        background: "#ffffff",
        borderRadius: "16px",
        padding: "20px",
        boxShadow: "0 8px 25px rgba(0,0,0,0.06)"
    };

    const formatXAxis = (tickItem) => {
        return new Date(tickItem).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div style={{ background: "#f1f5f9", minHeight: "100vh", padding: "32px" }}>
            <Container fluid>
                {/* HEADER */}
                <Row className="mb-4">
                    <Col>
                        <h1 style={{ fontWeight: "700", color: "#0f172a" }}>
                            Monitor DB Network Requests
                        </h1>
                        <p style={{ color: "#64748b" }}>
                            Review and filter database network requests
                        </p>
                    </Col>
                </Row>

                {/* SPLIT LAYOUT */}
                <div style={{ display: "flex", flexDirection: "row", gap: "24px", alignItems: "flex-start" }}>
                    {/* LEFT: OUTPUT CARD */}
                    <div style={{ flex: 2 }}>
                        <div style={{ ...cardStyle, height: "100%" }}>
                            <h5 style={{ fontWeight: "600", marginBottom: "16px", color: "#0f172a" }}>
                                Network Requests
                            </h5>

                            {isLoading ? (
                                <div className="d-flex justify-content-center py-5">
                                    <ThreeDots height="60" width="60" color="#0ea5e9" visible />
                                </div>
                            ) : (
                                <ScatterChart width={600} height={400}>
                                    <CartesianGrid />
                                    <XAxis domain={['dataMin', 'dataMax']} type="number" dataKey="timestamp" tickFormatter={formatXAxis} />
                                    <YAxis type="number" dataKey="value" />
                                    <Tooltip
                                        labelFormatter={(value) => new Date(value).toLocaleDateString()}
                                        cursor={{ strokeDasharray: '3 3' }}
                                    />
                                    <Scatter data={data} fill="green" />
                                </ScatterChart>
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
                                        { value: "timestamp", label: "Timestamp", type: "date" },
                                        { value: "value", label: "Value", type: "number" },
                                    ]}
                                    setSearchResults={setSearchResults}
                                    items={data}
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

export default MonitorDBNetworkRequests;