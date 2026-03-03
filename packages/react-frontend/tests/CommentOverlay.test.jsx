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


