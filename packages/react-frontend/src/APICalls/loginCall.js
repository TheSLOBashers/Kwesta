const loginCall = async (username, password, setError) => {
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

    const json = await response.json();
    if (!response.ok) {
      if(json.message === "Invalid username or password") {
        setError(json.message);
        throw new Error(`${json.message}`);
      }
      throw new Error(`Error: ${response.status}`);
    }
    localStorage.setItem('authToken', json.token);
    setError("");
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
