import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import CommentOverlay from "../src/components/CommentOverlay";

const mockComments = [
    {
        id: 1,
        author: "Bobby",
        comment: "Hello World",
        date: "2024-01-01T12:00:00Z",
        location: { lat: 10, lng: 20 },
    },
];

test("renders comments", () => {
    render(<CommentOverlay close={jest.fn()} comments={mockComments} />);

    expect(screen.getByText(/bobby/i)).toBeInTheDocument();
    expect(screen.getByText(/hello world/i)).toBeInTheDocument();
});

test("clicking backdrop calls close", async () => {
    const closeMock = jest.fn();

    const { container } = render(
        <CommentOverlay close={closeMock} comments={mockComments} />
    );

    await fireEvent.click(container.firstChild);

    expect(closeMock).toHaveBeenCalled();
});

test("clicking inside overlay does not call close", async () => {
    const closeMock = jest.fn();

    render(<CommentOverlay close={closeMock} comments={mockComments} />);

    const commentText = screen.getByText(/hello world/i);

    await fireEvent.click(commentText);

    expect(closeMock).not.toHaveBeenCalled();
});


describe("CommentOverlay scroll behavior", () => {
    const scrollMockComments = [
        {
            id: "1",
            author: "A",
            comment: "First",
            date: new Date(),
            location: { lat: 1, lng: 1 },
        },
        {
        id: "2",
            author: "B",
            comment: "Second",
            date: new Date(),
            location: { lat: 2, lng: 2 },
        },
        {
            id: "3",
            author: "C",
            comment: "Third",
            date: new Date(),
            location: { lat: 3, lng: 3 },
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
        render(<CommentOverlay close={jest.fn()} comments={scrollMockComments} />);

        const slider = screen.getByTestId("comment-slider");

        mockLayout(slider);

        slider.scrollLeft = 900;

        fireEvent.scroll(slider);

        const cards = slider.children;

        expect(cards[1]).toHaveStyle("transform: scale(1)");
        expect(cards[0]).toHaveStyle("transform: scale(0.92)");
    });

    test("keeps first card active when centered near start", () => {
        render(<CommentOverlay close={jest.fn()} comments={scrollMockComments} />);

        const slider = screen.getByTestId("comment-slider");

        mockLayout(slider);

        slider.scrollLeft = 0;

        fireEvent.scroll(slider);

        const cards = slider.children;

        expect(cards[0]).toHaveStyle("transform: scale(1)");
    });
});