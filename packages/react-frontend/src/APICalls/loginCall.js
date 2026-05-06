import backend from "./backend";

const loginCall = async (
  username,
  password,
  setError,
  setIsLoading
) => {
  try {
    setIsLoading(true);

    const response = await fetch(
      `${backend}/auth/login`,
      {
        method: "POST", // Specify the method
        headers: {
          "Content-Type": "application/json" // Indicate the content type
        },
        body: JSON.stringify({
          username, 
          password, 
          device_brand: "admin_portal",
          device_designName: "admin_portal",
          device_deviceName: "admin_portal",
          device_deviceYearClass: "admin_portal",
          device_deviceType: "admin_portal"
        }) // Convert the data to a JSON string
      }
    );

    const json = await response.json();
    if (!response.ok) {
      if (json.message === "Invalid username or password") {
        setError(json.message);
        throw new Error(`${json.message}`);
      } else if (json.message === "Account banned") {
        setError(json.message);
        throw new Error(`${json.message}`);
      }
      throw new Error(`Error: ${response.status}`);
    }

    if (json.permissions && (json.permissions === "moderator" || json.permissions === "admin")) {
      localStorage.setItem("moderator", true);
      if (json.permissions === "admin") {
        localStorage.setItem("admin", true);
      }
    }
    localStorage.setItem("authToken", json.token);
    setError("");
  } catch (error) {
    setError(
      error.message ||
      "Unable to connect. Is the server running?"
    );
    throw new Error(`Error: ${error.message}`);
  } finally {
    setIsLoading(false);
  }
};

export default loginCall;
