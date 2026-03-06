import React from "react";
import { useState, useEffect } from "react";

import CommentOverlay from "./CommentOverlay";
import CommentOpenButton from "./CommentOpenButton";

function Comments({ comments, setComments }) {
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
          setComments={setComments}
          close={() => setCommentIsOpen(false)}
        />
      )}
    </div>
  );
}

export default Comments;