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
import addQuestCall from "../APICalls/addQuestCall";

function UserFeed(props) {
  const [comments, setComments] = useState([]);
  const [events, setEvents] = useState([]);
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [clickedLocation, setclickedLocation] = useState({ lat: 0, lng: 0 });
  const [showClickMarkers, setShowClickMarkers] = useState(false);
  // New
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [selectedQuestId, setselectedQuestId] = useState(null);
  const [selectedEventId, setsselectedEventId] = useState(null);

  const selectedComment = useMemo(
    () => comments.find((c) => c.id === selectedCommentId) || null,
    [comments, selectedCommentId]
  );

  const selectedQuest = useMemo(
    () => quests.find((q) => q.id === selectedQuestId) || null,
    [quests, selectedQuestId]
  );

  const selectedEvent = useMemo(
    () => events.find((e) => e.id === selectedEventId) || null,
    [events, selectedEventId]
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
      ...newComment.comment,            // use backend response
      id: newComment.comment._id,
      author: props.user,
      likes: newComment.comment.likes || 0,
      likedByUser: (newComment.comment.likedBy || []).some(
        uid => uid.toString() === props.userId
      ),
      flaggedByUser: (newComment.comment.flags || []).some(
        f => f.toString() === props.userId
      ),
      location: newComment.location || { lat: 0, lng: 0 },
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
  const handleAddQuest = async data => {
    const newQuest = await addQuestCall(data.description, data.points, data.date, data.time, data.location);
    if (!newQuest) {
      return;
    }
    
    const questWithUsername = {
      ...newQuest,
      author: props.user
    };
    setQuests(prev => [
      {
        id: newQuest._id,
        author: newQuest.author?.username || newQuest.author,
        date: newQuest.date,
        time: newQuest.time,
        description: newQuest.description,
        location: newQuest.location,
        joined: false,
        image: newQuest.image,
        flag: newQuest.flag
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
          quests={quests}
          selectedQuest={selectedQuest}
          events={events}
          selectedEvent={selectedEvent}
          setclickedLocation={setclickedLocation}
          showClickMarkers={showClickMarkers}
          clickedLocation={clickedLocation}
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
          onSelectEvent={(event) => setsselectedEventId(event?.id ?? null)}
        />
        <Quests
          quests={quests}
          setQuests={setQuests}
          onPointsChanged={props.onPointsChanged}
          onSelectQuest={(quest) => setselectedQuestId(quest?.id ?? null)}
        />
      </div>

      <AddButtonOverlay
        username={props.user}
        onAddComment={handleAddComment}
        onAddEvent={handleAddEvent}
        onAddQuest={handleAddQuest}
        clickedLocation={clickedLocation}
        setShowClickMarkers={setShowClickMarkers}
      />
    </div>
  );
}

export default UserFeed;
