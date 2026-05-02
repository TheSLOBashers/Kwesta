import addQuestCall from "../APICalls/addQuestCall";
import { useState } from "react";

const AddQuest = () => {

    const [description, setDescription] = useState("");
    const [points, setPoints] = useState(0);
    const [time, setTime] = useState("");
    const [date, setDate] = useState("");
    const [location, setLocation] = useState({ lat: 0, lng: 0 });

    function handleChange(event) {
        if (event.target.name === "description") {
            setDescription(event.target.value);
        } else if (event.target.name === "points") {
            setPoints(Number(event.target.value));
        } else if (event.target.name === "time") {
            setTime(event.target.value);
        } else if (event.target.name === "date") {
            setDate(event.target.value);
        } else if (event.target.name === "location") {
            const [lat, lng] = event.target.value.split(",").map(Number);
            setLocation({ lat, lng });
        }
    }

    return (
        <div style={{ padding: "20px" }}>
            <h1>Add Quest</h1>
            <p>Add a new quest on this page.</p>
            <form onSubmit={(e) => {
                e.preventDefault();
                addQuestCall(description, points, date, time, location)
                    .then(() => {
                        alert("Successfully added the quest!");
                    })
                    .catch((error) => {
                        alert(`Failed to add the quest: ${error.message}`);
                    });
                setDescription("");
                setPoints(0);
                setTime("");
                setLocation({ lat: 0, lng: 0 });
            }}>
                <label htmlFor="description">Description:</label>
                <input type="text" id="description" name="description" required value = {description} onChange={handleChange}/>
                <label htmlFor="points">Points:</label>
                <input type="number" id="points" name="points" required value = {points} onChange={handleChange}/>
                <label htmlFor="date">Date:</label>
                <input type="date" id="date" name="date" required value = {date} onChange={handleChange}/>
                <label htmlFor="time">Time:</label>
                <input type="time" id="time" name="time" required value = {time} onChange={handleChange}/>
                <label htmlFor="location">Location (lat,lng):</label>
                <input type="text" id="location" name="location" required value = {`${location.lat},${location.lng}`} onChange={handleChange}/>
                <button type="submit">Add Quest</button>
            </form>
        </div>
    );
}

export default AddQuest;