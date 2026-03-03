import React from "react";
import { useState, useEffect } from "react";

import Comments from "./Comments";
import Events from "./Events";
import AddButtonOverlay from "./AddButtonOverlay";

import getCommentsCall from "../APICalls/getCommentsCall";
import getEventsCall from "../APICalls/getEventsCall";
import addCommentCall from "../APICalls/addCommentCall";
import addEventCall from "../APICalls/addEventCall";

function UserFeed(props) {
  const [comments, setComments] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const commentData = await getCommentsCall();
      const eventData = await getEventsCall();
      setComments(commentData);
      setEvents(eventData);
      setLoading(false);
    };
    
    fetchAll();
  }, []);

  const handleAddComment = async (data) => {
    const newComment = await addCommentCall(data);
    const commentWithUsername = {...newComment, author: props.user}
    setComments((prev) => [commentWithUsername, ...prev]);
  }
  const handleAddEvent = async (data) => {
    const newEvent = await addEventCall(data);
    const eventWithUsername = {...newEvent, author: props.user}
    setEvents((prev) => [eventWithUsername, ...prev]);
  }

  if (loading) return <div>Loading feed...</div>;
  
  
  console.log(events);

  return (
    <div>
      <Comments comments={comments} />
      <Events events={events} />

      <AddButtonOverlay
        username={props.user}
        onAddComment={handleAddComment}
        onAddEvent={handleAddEvent}
      />
    </div>
  );
}

export default UserFeed;
