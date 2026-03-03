import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import NavbarButton from "../src/components/NavbarButton";

test("renders CommentOpenButton text", () => {
    const handleClick = jest.fn();
    render(<NavbarButton onClick={handleClick} />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
});
