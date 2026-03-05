import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import AddButtonOverlay from "../src/components/AddButtonOverlay";
import addCommentCall from "../src/APICalls/addCommentCall";
import addEventCall from "../src/APICalls/addEventCall";

const mockAddComment = jest.fn();
const mockAddEvent = jest.fn();

test("renders AddButtonOverlay with AddButton", () => {
    render(<AddButtonOverlay username="testUser" onAddComment={mockAddComment}/>);

    const addButton = screen.getByRole("button", { name: /add button/i });
    expect(addButton).toBeInTheDocument();
});

test("opens comment and event buttons when AddButton is clicked", () => {
    render(<AddButtonOverlay username="testUser" onAddComment={mockAddComment}/>);

    const addButton = screen.getByRole("button", { name: /add button/i });
    fireEvent.click(addButton);

    const commentButton = screen.getByRole("button", { name: /add comment/i });
    const eventButton = screen.getByRole("button", { name: /add event/i });

    expect(commentButton).toBeInTheDocument();
    expect(eventButton).toBeInTheDocument();
});

test("clicking backdrop for comment calls close", async () => {
    render(<AddButtonOverlay username="testUser" onAddComment={mockAddComment}/>);

    const addButton = screen.getByRole("button", { name: /add button/i });
    fireEvent.click(addButton);

    const commentButton = screen.getByRole("button", { name: /add comment/i });
    expect(commentButton).toHaveStyle({ opacity: "1" });

    fireEvent.mouseDown(document.body);

    expect(commentButton).toHaveStyle({ opacity: "0" });
});

test("clicking backdrop for event calls close", async () => {
    render(<AddButtonOverlay username="testUser" onAddEvent={mockAddEvent}/>);

    const addButton = screen.getByRole("button", { name: /add button/i });
    fireEvent.click(addButton);

    const eventButton = screen.getByRole("button", { name: /add event/i });
    expect(eventButton).toHaveStyle({ opacity: "1" });

    fireEvent.mouseDown(document.body);

    expect(eventButton).toHaveStyle({ opacity: "0" });
});

test("clicking comment button opens CommentForm", () => {
    render(<AddButtonOverlay username="testUser" onAddComment={mockAddComment}/>);

    const addButton = screen.getByRole("button", { name: /add button/i });
    fireEvent.click(addButton);

    const commentButton = screen.getByRole("button", { name: /add comment/i });
    fireEvent.click(commentButton);

    const submitButton = screen.getByRole("button", { name: /submit comment/i });
    expect(submitButton).toBeInTheDocument();
});

test("clicking event button opens EventForm", () => {
    render(<AddButtonOverlay username="testUser" onAddEvent={mockAddEvent}/>);

    const addButton = screen.getByRole("button", { name: /add button/i });
    fireEvent.click(addButton);

    const eventButton = screen.getByRole("button", { name: /add event/i });
    fireEvent.click(eventButton);

    const submitButton = screen.getByRole("button", { name: /submit event/i });
    expect(submitButton).toBeInTheDocument();
});

test("calls onAddComment when CommentForm is submitted", async () => {
    render(<AddButtonOverlay username="testUser" onAddComment={mockAddComment}/>);
    fireEvent.click(screen.getByRole("button", { name: /add button/i }));
    fireEvent.click(screen.getByRole("button", { name: /add comment/i }));

    const sampleComment = "hi"
    const input = screen.getByPlaceholderText("Comment");
    fireEvent.change(input, { target: { value: sampleComment } });

    const submitCommentButton = screen.getByRole("button", { name: /submit comment/i });
    fireEvent.click(submitCommentButton);

    expect(mockAddComment).toHaveBeenCalledWith(
        expect.objectContaining({
            comment: "hi",
            location: { lat:0, lng:0 },
        })
    );
});


/*add event tests*/