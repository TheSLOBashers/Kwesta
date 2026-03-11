const getUserPointsCall = async () => {
  const authToken = localStorage.getItem("authToken");

  if (!authToken) {
    return 0;
  }

  try {
    const response = await fetch(
      "http://localhost:8000/users/me",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`
        }
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user points");
    }

    const data = await response.json();
    return data.points || 0;
  } catch (error) {
    console.error("Error fetching user points:", error);
    return 0;
  }
};

export default getUserPointsCall;
