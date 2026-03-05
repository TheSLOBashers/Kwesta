const getQuestsCall = async () => {
    try {
        const response = await fetch("http://localhost:8000/quests");
        if(!response.ok) {
            throw new Error("Failed to fetch quests");
        }

        const data = await response.json();

        const questsArray = data.quests || [];

        return questsArray.map(q => ({
            id: q._id,
            author: q.author?.username || q.author,
            date: q.date,
            description: q.description,
            location: q.location,
            flag: q.flag,
            points: q.points,
            time: q.time,
        }));
    } catch (err) {
        console.error("Error fetching quests:", err);
        return [];
    }
};

export default getQuestsCall;