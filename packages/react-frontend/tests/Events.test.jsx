import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import Events from "../src/components/Events";

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

test("displays events", async () => {
    render(<Events events={mockEvents} />)

    await screen.findByRole("button", { name: /open events/i });

    await fireEvent.click(screen.getByRole("button", { name: /open events/i }));

    expect(await screen.getByText(/hike here/i)).toBeInTheDocument();
});

test("closes event overlay", async () => {
    render(<Events events={mockEvents} />);

    fireEvent.click(screen.getByRole("button", { name: /open events/i }));

    const backdrop = screen.getByRole("dialog", { name: /events overlay/i });
    fireEvent.click(backdrop);

    await waitFor(() => {
        expect(screen.queryByRole("dialog", { name: /events overlay/i })).not.toBeInTheDocument();
    });
});