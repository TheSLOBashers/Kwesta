const addEventCall = async (eventData) => {
    try {
        const response = await fetch("http://localhost:8000/events", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(eventData),
        });
        
        const json = await response.json();
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        return json;
    } catch (err) {
        console.error("Error adding event:", err);
        return null;
    }
};

export default addEventCall;