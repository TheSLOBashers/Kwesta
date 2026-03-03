const getEventsCall = async () => {
    try {
        const response = await fetch("http://localhost:8000/events");
        if(!response.ok) {
            throw new Error("Failed to fetch events");
        }

        const data = await response.json();

        const eventsArray = data.events || [];

        return eventsArray.map(e => ({
            id: e._id,
            author: e.author?.username || e.author,
            date: e.date,
            time: e.time,
            description: e.description,
            location: e.location,
            rsvpCount: e.rsvpCount,
            image: e.image,
            flag: e.flag,
        }));
    } catch (err) {
        console.error("Error fetching events:", err);
        return [];
    }
};

export default getEventsCall;