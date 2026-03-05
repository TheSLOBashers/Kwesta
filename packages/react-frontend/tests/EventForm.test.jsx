import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EventForm from "../src/components/EventForm";

describe("EventForm", () => {
    const mockOnSubmit = jest.fn();
    const mockOnClose = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders input and button", () => {
        render(
            <EventForm
                onSubmit={mockOnSubmit}
                onClose={mockOnClose}
                username="Bobby"
            />
        );

        expect(screen.getByPlaceholderText("Description")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /submit event/i })).toBeInTheDocument();
    });

    test("updates input values when typing", () => {
        render(
            <EventForm
                onSubmit={mockOnSubmit}
                onClose={mockOnClose}
                username="Bobby"
            />
        );

        const descriptionInput = screen.getByPlaceholderText("Description");
        const dateInput = screen.getByTestId("date input");
        const timeInput = screen.getByTestId("time input");
        fireEvent.change(descriptionInput, { target: { value: "New Event" } });
        fireEvent.change(dateInput, { target: { value: "2024-01-01" } });
        fireEvent.change(timeInput, { target: { value: "12:00:00" } });

        expect(descriptionInput.value).toBe("New Event");
        expect(dateInput.value).toBe("2024-01-01");
        expect(timeInput.value).toBe("12:00:00");
    });

    test("submits form with correct data", async () => {
        render(
            <EventForm
                onSubmit={mockOnSubmit}
                onClose={mockOnClose}
                username="Bobby"
            />
        );

        const descriptionInput = screen.getByPlaceholderText("Description");
        const dateInput = screen.getByTestId("date input");
        const timeInput = screen.getByTestId("time input");
        fireEvent.change(descriptionInput, { target: { value: "New Event" } });
        fireEvent.change(dateInput, { target: { value: "2024-01-01" } });
        fireEvent.change(timeInput, { target: { value: "12:00:00" } });

        fireEvent.click(screen.getByRole("button", { name: /submit event/i }));

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledTimes(1);
        });

        const submittedData = mockOnSubmit.mock.calls[0][0];

        expect(submittedData.description).toBe("New Event");
        expect(submittedData.date).toBe("2024-01-01");
        expect(submittedData.time).toBe("12:00:00");
        
        expect(mockOnClose).toHaveBeenCalled();
    });

    test("does NOT submit if username is missing", () => {
        render(
            <EventForm
                onSubmit={mockOnSubmit}
                onClose={mockOnClose}
                username={null}
            />
        );

        const descriptionInput = screen.getByPlaceholderText("Description");
        const dateInput = screen.getByTestId("date input");
        const timeInput = screen.getByTestId("time input");
        fireEvent.change(descriptionInput, { target: { value: "New Event" } });
        fireEvent.change(dateInput, { target: { value: "2024-01-01" } });
        fireEvent.change(timeInput, { target: { value: "12:00:00" } });

        fireEvent.click(screen.getByRole("button", { name: /submit event/i }));

        expect(mockOnSubmit).not.toHaveBeenCalled();
        expect(mockOnClose).not.toHaveBeenCalled();
    });

    test("does NOT submit if only text is empty", () => {
        render(
            <EventForm
                onSubmit={mockOnSubmit}
                onClose={mockOnClose}
                username="Bobby"
            />
        );

        const dateInput = screen.getByTestId("date input");
        const timeInput = screen.getByTestId("time input");
        fireEvent.change(dateInput, { target: { value: "2024-01-01" } });
        fireEvent.change(timeInput, { target: { value: "12:00:00" } });

        fireEvent.click(screen.getByRole("button", { name: /submit event/i }));

        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test("does NOT submit if only date is empty", () => {
        render(
            <EventForm
                onSubmit={mockOnSubmit}
                onClose={mockOnClose}
                username="Bobby"
            />
        );

        const descriptionInput = screen.getByPlaceholderText("Description");
        const timeInput = screen.getByTestId("time input");
        fireEvent.change(descriptionInput, { target: { value: "New Event" } });
        fireEvent.change(timeInput, { target: { value: "12:00:00" } });

        fireEvent.click(screen.getByRole("button", { name: /submit event/i }));

        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test("does NOT submit if only time is empty", () => {
        render(
            <EventForm
                onSubmit={mockOnSubmit}
                onClose={mockOnClose}
                username="Bobby"
            />
        );

        const descriptionInput = screen.getByPlaceholderText("Description");
        const dateInput = screen.getByTestId("date input");
        fireEvent.change(descriptionInput, { target: { value: "New Event" } });
        fireEvent.change(dateInput, { target: { value: "2024-01-01" } });

        fireEvent.click(screen.getByRole("button", { name: /submit event/i }));

        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test("closes when clicking outside form", () => {
        render(
            <div>
                <EventForm
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
});