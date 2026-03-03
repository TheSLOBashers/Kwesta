import React from "react";
import { useState, useEffect } from "react";

import CommentOverlay from "./CommentOverlay";
import CommentOpenButton from "./CommentOpenButton";

function Comments({ comments }) {
  const [commentIsOpen, setCommentIsOpen] = useState(false);

  return (
    <div>
      <CommentOpenButton
        onClick={() => setCommentIsOpen(!commentIsOpen)}
      />

      {commentIsOpen && (
        <CommentOverlay
          key={comments.length}
          comments={comments}
          close={() => setCommentIsOpen(false)}
        />
      )}
    </div>
  );
}

export default Comments;


/*const sampleComments = [
    {
      id: 1,
      author: "Jimmy",
      date: "2/13/26",
      time: "2:00PM",
      comment: "Awesome sauce",
      location: {lat:500, lng:500},
    },
    {
      id: 2,
      author: "Timmy",
      date: "2/12/26",
      time: "4:14PM",
      comment: "Swag sauce",
      location: {lat:200, lng:90},
    },
    {
      id: 3,
      author: "Paul",
      date: "2/14/26",
      time: "1:02AM",
      comment: "Wassup",
      location: {lat:100, lng:700},
    },
    {
      id: 4,
      author: "Alex",
      date: "2/13/26",
      time: "6:41PM",
      comment: "Cool",
      location: {lat:2, lng:3},
    },
  ]
*/