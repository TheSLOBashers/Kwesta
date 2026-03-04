import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import EventOverlay from "../src/components/EventOverlay";

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

test("renders events", () => {
    render(<EventOverlay close={jest.fn()} events={mockEvents} />);

    expect(screen.getByText(/bobby/i)).toBeInTheDocument();
    expect(screen.getByText(/hike here/i)).toBeInTheDocument();
});

test("clicking backdrop calls close", async () => {
    const closeMock = jest.fn();

    const { container } = render(
        <EventOverlay close={closeMock} events={mockEvents} />
    );

    await fireEvent.click(container.firstChild);

    expect(closeMock).toHaveBeenCalled();
});

test("clicking inside overlay does not call close", async () => {
    const closeMock = jest.fn();

    render(<EventOverlay close={closeMock} events={mockEvents} />);

    const eventText = screen.getByText(/hike here/i);

    await fireEvent.click(eventText);

    expect(closeMock).not.toHaveBeenCalled();
});


