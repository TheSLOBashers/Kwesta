async function addQuestCall(description, points, date, time, location) {
    try {

    const response = await fetch(
      `http://localhost:8000/quests/`,
      {
        method: "POST", // Specify the method
        headers: {
          "Content-Type": "application/json", // Indicate the content type
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`
        },
        body: JSON.stringify({ description, points, date, time, location })
      }
    );

    const json = await response.json();
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return json;

  } catch (error) {
    throw new Error(`Error: ${error.message}`);
  } 
}

export default addQuestCall;