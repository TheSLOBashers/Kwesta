import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CommentForm from "../src/components/CommentForm";

describe("CommentForm", () => {
    const mockOnSubmit = jest.fn();
    const mockOnClose = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        global.navigator.geolocation = {
            getCurrentPosition: jest.fn((success) =>
                success({
                    coords: {
                        latitude: 35.3,
                        longitude: -120.7,
                    },
                })
            ),
        };
    });

    test("renders input and button", () => {
        render(
            <CommentForm
                onSubmit={mockOnSubmit}
                onClose={mockOnClose}
                username="Bobby"
            />
        );

        expect(screen.getByPlaceholderText("Comment")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /submit comment/i })).toBeInTheDocument();
    });

    test("updates input value when typing", () => {
        render(
            <CommentForm
                onSubmit={mockOnSubmit}
                onClose={mockOnClose}
                username="Bobby"
            />
        );

        const input = screen.getByPlaceholderText("Comment");

        fireEvent.change(input, { target: { value: "Hello World" } });

        expect(input.value).toBe("Hello World");
    });

    test("submits form with correct data", async () => {
        render(
            <CommentForm
                onSubmit={mockOnSubmit}
                onClose={mockOnClose}
                username="Bobby"
            />
        );

        const input = screen.getByPlaceholderText("Comment");
        const button = screen.getByRole("button", { name: /submit comment/i });

        fireEvent.change(input, { target: { value: "Test Comment" } });
        fireEvent.click(button);

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledTimes(1);
        });

        const submittedData = mockOnSubmit.mock.calls[0][0];

        expect(submittedData.comment).toBe("Test Comment");
        expect(submittedData.location).toEqual({
            lat: 35.3,
            lng: -120.7,
        });
        expect(submittedData.date).toBeInstanceOf(Date);

        expect(mockOnClose).toHaveBeenCalled();
    });

    test("does NOT submit if username is missing", () => {
        render(
            <CommentForm
                onSubmit={mockOnSubmit}
                onClose={mockOnClose}
                username={null}
            />
        );

        const input = screen.getByPlaceholderText("Comment");
        const button = screen.getByRole("button", { name: /submit comment/i });

        fireEvent.change(input, { target: { value: "Test Comment" } });
        fireEvent.click(button);

        expect(mockOnSubmit).not.toHaveBeenCalled();
        expect(mockOnClose).not.toHaveBeenCalled();
    });

    test("does NOT submit if text is empty", () => {
        render(
            <CommentForm
                onSubmit={mockOnSubmit}
                onClose={mockOnClose}
                username="Bobby"
            />
        );

        const button = screen.getByRole("button", { name: /submit comment/i });

        fireEvent.click(button);

        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test("closes when clicking outside form", () => {
        render(
            <div>
                <CommentForm
                    onSubmit={mockOnSubmit}
                    onClose={mockOnClose}
                    username="Bobby"
                />
                <div data-testid="outside">Outside</div>
            </div>
        );

        fireEvent.mouseDown(screen.getByTestId("outside"));

        expect(mockOnClose).toHaveBeenCalled();
    });

    test("sets location to 0,0 if geolocation fails", async () => {
        const mockOnSubmit = jest.fn();
        const mockOnClose = jest.fn();

        global.navigator.geolocation = {
            getCurrentPosition: jest.fn((success, error) =>
                error(new Error("Geolocation denied"))
            ),
        };

        render(
            <CommentForm
                onSubmit={mockOnSubmit}
                onClose={mockOnClose}
                username="Bobby"
            />
        );

        const input = screen.getByPlaceholderText("Comment");
        const button = screen.getByRole("button", { name: /submit comment/i });

        fireEvent.change(input, { target: { value: "Test Comment" } });
        fireEvent.click(button);

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledTimes(1);
        });

        const submittedData = mockOnSubmit.mock.calls[0][0];

        expect(submittedData.location).toEqual({
            lat: 0,
            lng: 0,
        });
    });
});