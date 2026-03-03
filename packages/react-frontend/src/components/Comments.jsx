import React from "react";
import { useState, useEffect } from "react";

import CommentOverlay from "./CommentOverlay";
import CommentOpenButton from "./CommentOpenButton";
import getCommentsCall from "../APICalls/getCommentsCall";
import AddButtonOverlay from "./AddButtonOverlay";
import addCommentCall from "../APICalls/addCommentCall";

function Comments(props) {
  const [comments, setComments] = useState([]);
  const [commentIsOpen, setCommentIsOpen] = useState(false);
  const [addIsOpen, setAddIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      const data = await getCommentsCall();
      setComments(data);
      setLoading(false);
    };

    fetchComments();
  }, []);

  const handleAddComment = async (commentData) => {
    const newComment = await addCommentCall(commentData);
    const commentWithUsername = {...newComment, author: props.user}
    setComments((prev) => [commentWithUsername, ...prev]);
  }

  
  return (
    <div>
      <>
        {loading && <div>Loading comments...</div>}
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
      </>

      <AddButtonOverlay 
        username={props.user || "Anonymous"}
        onAddComment={handleAddComment}
      />
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