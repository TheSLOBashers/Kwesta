import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TopBar from "../src/components/TopBar";

test("renders TopBar with title", () => {
    render(
        <MemoryRouter>
            <TopBar />
        </MemoryRouter>
    );

    expect(screen.getByText("Kwesta")).toBeInTheDocument();
});

test("opens OverlayNavbar when NavbarButton is clicked", () => {
    render(
        <MemoryRouter>
            <TopBar />
        </MemoryRouter>
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Quests")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
});

test("closes OverlayNavbar when overlay background is clicked", () => {
    render(
        <MemoryRouter>
            <TopBar />
        </MemoryRouter>
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    const overlay = screen.getByRole("presentation");
    fireEvent.click(overlay);

    expect(screen.queryByText("Home")).not.toBeInTheDocument();
});