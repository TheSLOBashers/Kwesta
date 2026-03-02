import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import AddButtonOverlay from "../src/components/AddButtonOverlay";
import addCommentCall from "../src/APICalls/addCommentCall";
import addEventCall from "../src/APICalls/addEventCall";

// Mock the API calls
jest.mock("../src/APICalls/addCommentCall");
jest.mock("../src/APICalls/addEventCall");

test("renders AddButtonOverlay with AddButton", () => {
    render(<AddButtonOverlay />);

    const addButton = screen.getByRole("button", { name: /add button/i });
    expect(addButton).toBeInTheDocument();
});

test("opens comment and event buttons when AddButton is clicked", () => {
    render(<AddButtonOverlay />);

    const addButton = screen.getByRole("button", { name: /add button/i });
    fireEvent.click(addButton);

    const commentButton = screen.getByRole("button", { name: /add comment/i });
    const eventButton = screen.getByRole("button", { name: /add event/i });

    expect(commentButton).toBeInTheDocument();
    expect(eventButton).toBeInTheDocument();
});

test("clicking comment button opens CommentForm", () => {
    render(<AddButtonOverlay />);

    const addButton = screen.getByRole("button", { name: /add button/i });
    fireEvent.click(addButton);

    const commentButton = screen.getByRole("button", { name: /add comment/i });
    fireEvent.click(commentButton);

    const submitButton = screen.getByRole("button", { name: /submit comment/i });
    expect(submitButton).toBeInTheDocument();
});

test("calls addCommentCall when CommentForm is submitted", async () => {
    addCommentCall.mockResolvedValue({ success: true });

    render(<AddButtonOverlay />);
    fireEvent.click(screen.getByRole("button", { name: /add button/i }));
    fireEvent.click(screen.getByRole("button", { name: /add comment/i }));

    const sampleComment = "hi"
    const input = screen.getByPlaceholderText("Comment");
    fireEvent.change(input, { target: { value: sampleComment } });

    const submitCommentButton = screen.getByRole("button", { name: /submit comment/i });
    fireEvent.click(submitCommentButton);

    expect(addCommentCall).toHaveBeenCalled();
});


/*add event tests*/