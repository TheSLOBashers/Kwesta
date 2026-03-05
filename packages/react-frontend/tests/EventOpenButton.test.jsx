import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import EventOpenButton from "../src/components/EventOpenButton";

test("renders EventOpenButton text", () => {
  render(<EventOpenButton />);
  const button = screen.getByRole("button");
  expect(button).toBeInTheDocument();
});
