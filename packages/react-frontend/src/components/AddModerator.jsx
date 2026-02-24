import AddModeratorCall from "../APICalls/addModeratorCall";
import { useState } from "react";

const AddModerator = () => {

    const [username, setUsername] = useState("");

    function handleChange(event) {
        setUsername(event.target.value);
    }

    return (
        <div>
            <h1>Add Moderator</h1>
            <p>Add a moderator on this page.</p>
            <form onSubmit={(e) => {
                e.preventDefault();
                const username = e.target.username.value;
                AddModeratorCall(username)
                    .then(() => {
                        alert(`Successfully added ${username} as a moderator!`);
                    })
                    .catch((error) => {
                        alert(`Failed to add ${username} as a moderator: ${error.message}`);
                    });
                setUsername("");
            }}>
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" name="username" required value = {username} onChange={handleChange}/>
                <button type="submit">Add Moderator</button>
            </form>
        </div>
    );
}

export default AddModerator;