import { useNavigate } from "react-router-dom";

function LogOutButton(){

    const navigate = useNavigate();

    function handleClick() {
        localStorage.removeItem("authToken");
        localStorage.removeItem("username");
        localStorage.removeItem("moderator");
        navigate("/Login", { replace: true });
    }

    return (
        <button 
            onClick={handleClick}
        >
            Log Out
        </button>
    );
}

export default LogOutButton;