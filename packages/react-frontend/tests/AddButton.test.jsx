import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import AddButton from "../src/components/AddButton";

test("renders AddButton text", () => {
  render(<AddButton />);
  const button = screen.getByRole("button");
  expect(button).toBeInTheDocument();
});
