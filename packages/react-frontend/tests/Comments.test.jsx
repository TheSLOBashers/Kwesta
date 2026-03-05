import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import Comments from "../src/components/Comments";

const mockComments = [
    {
        id: 1,
        author: "Bobby",
        date: "2024-01-01T12:00:00Z",
        comment: "Hello World",
        location: { lat: 1, lng: 2 },
    },
];

test("displays comments", async () => {
    render(<Comments comments={mockComments} />)

    await screen.findByRole("button", { name: /open comments/i });

    await fireEvent.click(screen.getByRole("button", { name: /open comments/i }));

    expect(await screen.getByText(/hello world/i)).toBeInTheDocument();
});

test("closes comment overlay", async () => {
    render(<Comments comments={mockComments} />);

    fireEvent.click(screen.getByRole("button", { name: /open comments/i }));

    const backdrop = screen.getByRole("dialog", { name: /comments overlay/i });
    fireEvent.click(backdrop);

    await waitFor(() => {
        expect(screen.queryByRole("dialog", { name: /comments overlay/i })).not.toBeInTheDocument();
    });
});