const addEventCall = async (eventData) => {
    try {
        const authToken = localStorage.getItem("authToken");
        const response = await fetch("http://localhost:8000/events", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify(eventData),
        });
        
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const json = await response.json();
        return json;
    } catch (err) {
        console.error("Error adding event:", err);
        return null;
    }
};

export default addEventCall;