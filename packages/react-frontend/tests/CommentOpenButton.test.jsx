import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import CommentOpenButton from "../src/components/CommentOpenButton";

test("renders CommentOpenButton text", () => {
  render(<CommentOpenButton />);
  const button = screen.getByRole("button");
  expect(button).toBeInTheDocument();
});
