import backend from "./backend";

const monitoringFetchDBData = async (setError, setIsLoading, analyticName) => {
  try {

    setIsLoading(true);

    const response = await fetch(
      `${backend}/statistics/mdb/${analyticName}`,
      {
        method: "GET", // Specify the method
        headers: {
          "Content-Type": "application/json", // Indicate the content type
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`
        }
      }
    );

    const json = await response.json();
    if (!response.ok) {
      setError("Error while fetching comments");
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

export default monitoringFetchDBData;
