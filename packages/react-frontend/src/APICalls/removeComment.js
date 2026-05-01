import backend from "./backend";

async function removeComment(index) {
    try {

    const response = await fetch(
      `${backend}/comments/remove/${index}`,
      {
        method: "PUT", // Specify the method
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

export default removeComment;