async function unjoinEvent(index) {
    try {

    const response = await fetch(
      `http://localhost:8000/events/unjoin/${index}`,
      {
        method: "POST", // Specify the method
        headers: {
          "Content-Type": "application/json", // Indicate the content type
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`
        }
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

export default unjoinEvent;