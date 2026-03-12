import React from "react";
import { useState, useEffect } from "react";

import Comments from "./Comments";
import Events from "./Events";
import Quests from "./Quests";
import AddButtonOverlay from "./AddButtonOverlay";

import getCommentsCall from "../APICalls/getCommentsCall";
import getEventsCall from "../APICalls/getEventsCall";
import getQuestsCall from "../APICalls/getQuestsCall";
import addCommentCall from "../APICalls/addCommentCall";
import addEventCall from "../APICalls/addEventCall";

function UserFeed(props) {
  const [comments, setComments] = useState([]);
  const [events, setEvents] = useState([]);
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const commentData = await getCommentsCall();
      const eventData = await getEventsCall();
      const questData = await getQuestsCall();
      setComments(commentData);
      setEvents(eventData);
      setQuests(questData);
      setLoading(false);
    };

    fetchAll();
  }, []);

  const handleAddComment = async data => {
    const newComment = await addCommentCall(data);
    if (!newComment) {
      return;
    }

    const commentWithUsername = {
      ...newComment,
      id: newComment._id || newComment.id,
      author: props.user,
      likes: newComment.likes || 0,
      likedByUser: false,
      flaggedByUser: false
    };
    setComments(prev => [commentWithUsername, ...prev]);
    if (props.onPointsChanged) {
      await props.onPointsChanged();
    }
  };
  const handleAddEvent = async data => {
    const newEvent = await addEventCall(data);
    if (!newEvent) {
      return;
    }

    const eventWithUsername = {
      ...newEvent,
      author: props.user
    };
    setEvents(prev => [eventWithUsername, ...prev]);
    if (props.onPointsChanged) {
      await props.onPointsChanged();
    }
  };

  if (loading) return <div>Loading feed...</div>;

  return (
    <div>
      <Comments
        comments={comments}
        setComments={setComments}
        onPointsChanged={props.onPointsChanged}
      />
      <Events 
        events={events} 
        setEvents={setEvents}
        onPointsChanged={props.onPointsChanged}
      />
      <Quests
        quests={quests}
        setQuests={setQuests}
        onPointsChanged={props.onPointsChanged}
      />

      <AddButtonOverlay
        username={props.user}
        onAddComment={handleAddComment}
        onAddEvent={handleAddEvent}
      />
    </div>
  );
}

export default UserFeed;
