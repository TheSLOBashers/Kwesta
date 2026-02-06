const loginCall = async (username, password) => {
  try {
    const response = await fetch(
      "http://localhost:8000/auth/login",
      {
        method: "POST", // Specify the method
        headers: {
          "Content-Type": "application/json" // Indicate the content type
        },
        body: JSON.stringify({username, password}) // Convert the data to a JSON string
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const json = await response.json();
    localStorage.setItem('authToken', json.token);
  } catch (error) {
    throw new Error(`Error: ${error.message}`);
  } 
  /* LATER
  finally {
    setIsLoading(false);
  }
    */
};

export default loginCall;
