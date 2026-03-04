import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import UserFeed from "../src/components/UserFeed";

import getCommentsCall from "../src/APICalls/getCommentsCall";
import getEventsCall from "../src/APICalls/getEventsCall";
import addCommentCall from "../src/APICalls/addCommentCall";
import addEventCall from "../src/APICalls/addEventCall";

jest.mock("../src/APICalls/getCommentsCall");
jest.mock("../src/APICalls/getEventsCall");
jest.mock("../src/APICalls/addCommentCall");
jest.mock("../src/APICalls/addEventCall");

const mockComments = [
    {
        id: 1,
        author: "Bobby",
        date: "2024-01-01T12:00:00Z",
        comment: "Hello World",
        location: { lat: 1, lng: 2 },
    },
];

const mockEvents = [
    {
        id: 123,
        author: "Bobby",
        date: "2024-01-01",
        time: "12:00:00Z",
        description: "Hike here",
        location: { lat: 12, lng: 23 },
        rsvpCount: 2
    },
];

getCommentsCall.mockResolvedValue(mockComments);
getEventsCall.mockResolvedValue(mockEvents);

test("fetches and displays comments", async () => {
    render(<UserFeed user={"testUser"} />)

    await screen.findByRole("button", { name: /open comments/i });

    await fireEvent.click(screen.getByRole("button", { name: /open comments/i }));

    expect(await screen.getByText(/hello world/i)).toBeInTheDocument();
});

test("fetches and displays events", async () => {
    render(<UserFeed user={"testUser"} />)

    await screen.findByRole("button", { name: /open events/i });

    await fireEvent.click(screen.getByRole("button", { name: /open events/i }));

    expect(await screen.getByText(/hike here/i)).toBeInTheDocument();
});

test("adds a comment and updates overlay", async () => {
    addCommentCall.mockResolvedValue({
        _id: "mockedId",
        comment: "New Comment",
        author: "testUser",
        location: { lat: 0, lng: 0 },
        date: new Date().toISOString(),
    });

    render(<UserFeed user={"testUser"} />);

    await screen.findByRole("button", { name: /add button/i });
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

test("adds an event and updates overlay", async () => {
    addEventCall.mockResolvedValue({
        _id: "mockedId",
        description: "New Event",
        author: "testUser",
        location: { lat: 0, lng: 0 },
        date: "2024-01-01",
        time: "12:00:00",
        rsvpCount: 2
    });

    render(<UserFeed user={"testUser"} />);

    await screen.findByRole("button", { name: /add button/i });
    fireEvent.click(screen.getByRole("button", { name: /add button/i }));
    fireEvent.click(screen.getByRole("button", { name: /add event/i }));

    const descriptionInput = screen.getByPlaceholderText("Description");
    const dateInput = screen.getByTestId("date input");
    const timeInput = screen.getByTestId("time input");
    fireEvent.change(descriptionInput, { target: { value: "New Event" } });
    fireEvent.change(dateInput, { target: { value: "2024-01-01" } });
    fireEvent.change(timeInput, { target: { value: "12:00:00" } });

    await act(async () => {
        fireEvent.click(screen.getByRole("button", { name: /submit event/i }));
    });

    expect(addEventCall).toHaveBeenCalledWith(
        expect.objectContaining({
            description: "New Event",
            location: { lat:0, lng:0 },
            date: "2024-01-01",
            time: "12:00:00",
        })
    );

    fireEvent.click(screen.getByRole("button", { name: /open events/i }));

    await waitFor(() => {
        expect(screen.getByText(/New Event/i)).toBeInTheDocument();
        expect(screen.getByText(/testUser\s*-/i)).toBeInTheDocument();
    });
});