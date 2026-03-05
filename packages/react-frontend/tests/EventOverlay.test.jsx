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


describe("EventOverlay scroll behavior", () => {
    const scrollMockEvents = [
        {
            id: "1",
            author: "A",
            date: "2006-07-20",
            time: "12:00:00Z",
            description: "First",
            location: { lat: 1, lng: 1 },
            rsvpCount: 1
        },
        {
            id: "2",
            author: "B",
            date: "2025-02-21",
            time: "01:00:00Z",
            description: "Second",
            location: { lat: 2, lng: 2 },
            rsvpCount: 2
        },
        {
            id: "3",
            author: "C",
            date: "2026-01-02",
            time: "07:00:00Z",
            description: "Third",
            location: { lat: 3, lng: 3 },
            rsvpCount: 3
        },
    ];

    function mockLayout(container) {
        Object.defineProperty(container, "clientWidth", {
            value: 1000,
            configurable: true,
        });

        Object.defineProperty(container, "scrollLeft", {
            value: 0,
            writable: true,
            configurable: true,
        });

        [...container.children].forEach((child, i) => {
            Object.defineProperty(child, "offsetLeft", {
                value: i * 900,
                configurable: true,
            });

            Object.defineProperty(child, "clientWidth", {
                value: 800,
                configurable: true,
            });
        });
    }

    test("sets active to closest card when scrolled", () => {
        render(<EventOverlay close={jest.fn()} events={scrollMockEvents} />);

        const slider = screen.getByTestId("event-slider");

        mockLayout(slider);

        slider.scrollLeft = 900;

        fireEvent.scroll(slider);

        const cards = slider.children;

        expect(cards[1]).toHaveStyle("transform: scale(1)");
        expect(cards[0]).toHaveStyle("transform: scale(0.92)");
    });

    test("keeps first card active when centered near start", () => {
        render(<EventOverlay close={jest.fn()} events={scrollMockEvents} />);

        const slider = screen.getByTestId("event-slider");

        mockLayout(slider);

        slider.scrollLeft = 0;

        fireEvent.scroll(slider);

        const cards = slider.children;

        expect(cards[0]).toHaveStyle("transform: scale(1)");
    });
});