import React from "react";
import { useState, useEffect, useMemo } from "react";

import Comments from "./Comments";
import Events from "./Events";
import Quests from "./Quests";
import AddButtonOverlay from "./AddButtonOverlay";
import MapSection from './MapSection';

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

  // New
  const [selectedCommentId, setSelectedCommentId] = useState(null);

  const selectedComment = useMemo(
    () => comments.find((c) => c.id === selectedCommentId) || null,
    [comments, selectedCommentId]
  );

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
    setEvents(prev => [
      {
        id: newEvent._id,
        author: newEvent.author?.username || newEvent.author,
        date: newEvent.date,
        time: newEvent.time,
        description: newEvent.description,
        location: newEvent.location,
        joined: false,
        image: newEvent.image,
        flag: newEvent.flag
      },
      ...prev]);
    if (props.onPointsChanged) {
      await props.onPointsChanged();
    }
  };

  if (loading) return <div>Loading feed...</div>;

  return (
    <div>
      <div style={{ height: "calc(100vh - 140px)", width: "100%" }}>
        <MapSection 
          comments={comments} 
          selectedComment={selectedComment}
        />
      </div>
      <div style={{ height: "10vh", width: "100%"}}>
        <Comments
          comments={comments}
          setComments={setComments}
          onPointsChanged={props.onPointsChanged}
          onSelectComment={(comment) => setSelectedCommentId(comment?.id ?? null)}
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
      </div>

      <AddButtonOverlay
        username={props.user}
        onAddComment={handleAddComment}
        onAddEvent={handleAddEvent}
      />
    </div>
  );
}

export default UserFeed;
