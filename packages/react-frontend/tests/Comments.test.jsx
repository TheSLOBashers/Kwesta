import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import Comments from "../src/components/Comments";
import getCommentsCall from "../src/APICalls/getCommentsCall";
import addCommentCall from "../src/APICalls/addCommentCall";

jest.mock("../src/APICalls/getCommentsCall");
jest.mock("../src/APICalls/addCommentCall");

test("fetches and displays comments", async () => {
    const mockComments = [
        {
            id: 1,
            author: "Bobby",
            date: "2024-01-01T12:00:00Z",
            comment: "Hello World",
            location: { lat: 1, lng: 2 },
        },
    ];

    getCommentsCall.mockResolvedValue(mockComments);

    render(<Comments user="Bobby" />)

    await screen.findByRole("button", { name: /open comments/i });

    await fireEvent.click(screen.getByRole("button", { name: /open comments/i }));

    expect(await screen.getByText(/hello world/i)).toBeInTheDocument();
});

test("adds a comment and updates overlay", async () => {
    addCommentCall.mockResolvedValue({
        _id: "mockedId",
        comment: "New Comment",
        author: "testUser",
        location: { lat: 0, lng: 0 },
        date: new Date().toISOString(),
    });

    render(<Comments user={"testUser"} />);

    fireEvent.click(screen.getByRole("button", { name: /add button/i }));
    fireEvent.click(screen.getByRole("button", { name: /add comment/i }));

    const input = screen.getByPlaceholderText("Comment");
    fireEvent.change(input, { target: { value: "New Comment" } });

    await act(async () => {
        fireEvent.click(screen.getByRole("button", { name: /submit comment/i }));
    });

    expect(addCommentCall).toHaveBeenCalledWith(
        expect.objectContaining({
            comment: "New Comment",
            location: { lat:0, lng:0 },
        })
    );

    fireEvent.click(screen.getByRole("button", { name: /open comments/i }));

    await waitFor(() => {
        expect(screen.getByText(/New Comment/i)).toBeInTheDocument();
        expect(screen.getByText(/testUser\s*-/i)).toBeInTheDocument();
    });
});

test("closes comment overlay", async () => {
    render(<Comments user={"testUser"} />);

    fireEvent.click(screen.getByRole("button", { name: /open comments/i }));

    const backdrop = screen.getByRole("dialog", { name: /comments overlay/i });
    fireEvent.click(backdrop);

    await waitFor(() => {
        expect(screen.queryByRole("dialog", { name: /comments overlay/i })).not.toBeInTheDocument();
    });
});