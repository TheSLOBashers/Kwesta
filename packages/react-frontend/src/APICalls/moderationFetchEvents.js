import backend from "./backend";

const moderationFetchEvents = async (setError, setIsLoading, searchParams) => {
  try {

    setIsLoading(true);

    const response = await fetch(
      `${backend}/events/search`,
      {
        method: "POST", // Specify the method
        headers: {
          "Content-Type": "application/json", // Indicate the content type
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`
        },
        body: JSON.stringify(searchParams) // Convert the search parameters to JSON
      }
    );

    const json = await response.json();
    if (!response.ok) {
      setError("Error while fetching events");
      throw new Error(`Error: ${response.status}`);
    }

    return json;

  } catch (error) {
    throw new Error(`Error: ${error.message}`);
  } 
  finally {
    setIsLoading(false);
  }
};

export default moderationFetchEvents;
