import backend from "./backend"

const pingBackend = async () => {
    try {
        const response = await fetch(backend, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return response;
    } catch (err) {
        console.error("Error pinging backend:", err);
        return null;
    }
};

export default pingBackend;