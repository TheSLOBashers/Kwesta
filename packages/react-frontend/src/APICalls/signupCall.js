const signupCall = async (username, email, password, setError) => {
  try {
    const response = await fetch(
      "http://localhost:8000/users/",
      {
        method: "POST", // Specify the method
        headers: {
          "Content-Type": "application/json" // Indicate the content type
        },
        body: JSON.stringify({username, email, password}) // Convert the data to a JSON string
      }
    );

    const json = await response.json();
    if (!response.ok) {
      if(json.message === "Username already exists" || json.message === "Email already exists") {
        setError(json.message);
        throw new Error(`${json.message}`);
      }
      throw new Error(`Error: ${response.status}`);
    }
    setError("");
  } catch (error) {
    throw new Error(`${error.message}`);
  } 
  /* LATER
  finally {
    setIsLoading(false);
  }
    */
};

export default signupCall;
