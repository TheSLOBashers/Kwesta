const signupCall = async (
  username,
  email,
  password,
  setError,
  setIsLoading
) => {
  try {
    setIsLoading(true);

    const response = await fetch(
      "http://localhost:8000/users/",
      {
        method: "POST", // Specify the method
        headers: {
          "Content-Type": "application/json" // Indicate the content type
        },
        body: JSON.stringify({ username, email, password }) // Convert the data to a JSON string
      }
    );

    const text = await response.json().then((data) => data.message || "No message in response");
    if (!response.ok) {
      if (
        text === "Username already exists" ||
        text === "Email already exists"
      ) {
        setError(text);
        throw new Error(`${text}`);
      }
      throw new Error(`${text}`);
    }
    setError("");
  } catch (error) {
    setError(
      error.message ||
        "Unable to connect. Is the server running?"
    );
    throw new Error(`${error.message}`);
  } finally {
    setIsLoading(false);
  }
};

export default signupCall;
