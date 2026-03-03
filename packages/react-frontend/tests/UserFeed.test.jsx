import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import UserFeed from "../src/components/UserFeed";

const mockComments = [
    {
        id: 1,
        author: "Bobby",
        date: "2024-01-01T12:00:00Z",
        comment: "Hello World",
        location: { lat: 1, lng: 2 },
    },
];

test("displays comments", async () => {
    render(<Comments comments={mockComments} />)

    await screen.findByRole("button", { name: /open comments/i });

    await fireEvent.click(screen.getByRole("button", { name: /open comments/i }));

    expect(await screen.getByText(/hello world/i)).toBeInTheDocument();
});

// test("adds a comment and updates overlay", async () => {
//     addCommentCall.mockResolvedValue({
//         _id: "mockedId",
//         comment: "New Comment",
//         author: "testUser",
//         location: { lat: 0, lng: 0 },
//         date: new Date().toISOString(),
//     });

//     render(<Comments user={"testUser"} />);

//     fireEvent.click(screen.getByRole("button", { name: /add button/i }));
//     fireEvent.click(screen.getByRole("button", { name: /add comment/i }));

//     const input = screen.getByPlaceholderText("Comment");
//     fireEvent.change(input, { target: { value: "New Comment" } });

//     await act(async () => {
//         fireEvent.click(screen.getByRole("button", { name: /submit comment/i }));
//     });

//     expect(addCommentCall).toHaveBeenCalledWith(
//         expect.objectContaining({
//             comment: "New Comment",
//             location: { lat:0, lng:0 },
//         })
//     );

//     fireEvent.click(screen.getByRole("button", { name: /open comments/i }));

//     await waitFor(() => {
//         expect(screen.getByText(/New Comment/i)).toBeInTheDocument();
//         expect(screen.getByText(/testUser\s*-/i)).toBeInTheDocument();
//     });
// });
