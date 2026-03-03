import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import OverlayNavbar from "../src/components/OverlayNavbar";

test("renders OverlayNavbar with links", () => {
    const closeMock = jest.fn();
    render(
        <MemoryRouter>
            <OverlayNavbar close={closeMock} />
        </MemoryRouter>
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Quests")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
});

test("calls close when overlay is clicked", () => {
    const closeMock = jest.fn();
    render(
        <MemoryRouter>
            <OverlayNavbar close={closeMock} />
        </MemoryRouter>
    );

    const overlay = screen.getByRole("presentation");
    fireEvent.click(overlay);
    expect(closeMock).toHaveBeenCalledTimes(1);
});

test("does not call close when box is clicked", () => {
    const closeMock = jest.fn();
    render(
        <MemoryRouter>
            <OverlayNavbar close={closeMock} />
        </MemoryRouter>
    );

    const box = screen.getByText("Home").closest("div"); 
    fireEvent.click(box);
    expect(closeMock).not.toHaveBeenCalled();
});

test("calls close when a link is clicked", () => {
    const closeMock = jest.fn();
    render(
        <MemoryRouter>
            <OverlayNavbar close={closeMock} />
        </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Home"));
    fireEvent.click(screen.getByText("Quests"));
    fireEvent.click(screen.getByText("About"));

    expect(closeMock).toHaveBeenCalledTimes(3);
});