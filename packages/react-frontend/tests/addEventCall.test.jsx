import addEventCall from "../src/APICalls/addEventCall";

describe("addEventCall", () => {
    const eventData = { 
        description: "Test Event", 
        date: "2024-01-01", 
        time: "12:00:00Z", 
        location: { lat: 0, lng: 0 } 
    };
    const authToken = "mockedToken";

    beforeEach(() => {
        Storage.prototype.getItem = jest.fn(() => authToken);

        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("sends a POST request and returns the event on success", async () => {
        const mockResponse = { event: eventData };

        fetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => mockResponse,
        });

        const result = await addEventCall(eventData);

        expect(fetch).toHaveBeenCalledWith("http://localhost:8000/events", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`,
            },
            body: JSON.stringify(eventData),
        });

        expect(result).toEqual({event: eventData});
    });

    it("returns null and logs an error when response is not ok", async () => {
        console.error = jest.fn();

        fetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
            json: async () => ({ message: "Server error" }),
        });

        const result = await addEventCall(eventData);

        expect(result).toBeNull();
        expect(console.error).toHaveBeenCalledWith(
            "Error adding event:",
            expect.any(Error)
        );
    });

    it("returns null and logs an error when fetch throws", async () => {
        console.error = jest.fn();

        fetch.mockRejectedValueOnce(new Error("Network Error"));

        const result = await addEventCall(eventData);

        expect(result).toBeNull();
        expect(console.error).toHaveBeenCalledWith(
            "Error adding event:",
            expect.any(Error)
        );
    });
});