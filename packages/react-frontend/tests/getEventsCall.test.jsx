import getEventsCall from "../src/APICalls/getEventsCall";

global.fetch = jest.fn();

describe("getEventsCall", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("returns formatted events on successful fetch", async () => {
        const mockApiResponse = {
            events: [
                {
                    _id: "123",
                    author: "Bobby",
                    date: "2024-01-01",
                    time: "12:00:00Z",
                    description: "Hike here",
                    location: { lat: 12, lng: 23 },
                    rsvpCount: 2,
                    flag: false,
                },
                {
                    _id: "456",
                    author: "Timmy",
                    date: "2025-02-05",
                    time: "5:00:00Z",
                    description: "Pizza time",
                    location: { lat: 14.00102, lng: 43.12368 },
                    rsvpCount: 5,
                    flag: true,
                },
            ],
        };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockApiResponse,
        });

        const events = await getEventsCall();

        expect(fetch).toHaveBeenCalledWith("http://localhost:8000/events");
        expect(events).toEqual([
            {
                id: "123",
                author: "Bobby",
                date: "2024-01-01",
                time: "12:00:00Z",
                description: "Hike here",
                location: { lat: 12, lng: 23 },
                rsvpCount: 2,
                flag: false,
            },
            {
                id: "456",
                author: "Timmy",
                date: "2025-02-05",
                time: "5:00:00Z",
                description: "Pizza time",
                location: { lat: 14.00102, lng: 43.12368 },
                rsvpCount: 5,
                flag: true,
            },
        ]);
    });

    test("returns empty array if fetch fails", async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
        });

        const events = await getEventsCall();
        expect(events).toEqual([]);
    });

    test("returns empty array if fetch throws error", async () => {
        fetch.mockResolvedValueOnce(new Error("Network error"));

        const events = await getEventsCall();
        expect(events).toEqual([]);
    });
});