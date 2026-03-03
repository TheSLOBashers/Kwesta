import addCommentCall from "../src/APICalls/addCommentCall";

describe("addCommentCall", () => {
    const commentData = { comment: "Test Comment", location: { lat: 0, lng: 0 } };
    const authToken = "mockedToken";

    beforeEach(() => {
        Storage.prototype.getItem = jest.fn(() => authToken);

        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("sends a POST request and returns the comment on success", async () => {
        const mockResponse = { comment: commentData.comment };

        fetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => mockResponse,
        });

        const result = await addCommentCall(commentData);

        expect(fetch).toHaveBeenCalledWith("http://localhost:8000/comments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`,
            },
            body: JSON.stringify(commentData),
        });

        expect(result).toBe(commentData.comment);
    });

    it("returns null and logs an error when response is not ok", async () => {
        console.error = jest.fn();

        fetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
            json: async () => ({ message: "Server error" }),
        });

        const result = await addCommentCall(commentData);

        expect(result).toBeNull();
        expect(console.error).toHaveBeenCalledWith(
            "Error adding comment:",
            expect.any(Error)
        );
    });

    it("returns null and logs an error when fetch throws", async () => {
        console.error = jest.fn();

        fetch.mockRejectedValueOnce(new Error("Network Error"));

        const result = await addCommentCall(commentData);

        expect(result).toBeNull();
        expect(console.error).toHaveBeenCalledWith(
            "Error adding comment:",
            expect.any(Error)
        );
    });
});