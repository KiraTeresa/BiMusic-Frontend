import { useLocation } from "react-router-dom"
import ChatList from "../../components/Chat/ChatList";

function Chat() {
    const location = useLocation();

    return (
        <div style={{ display: "flex", justifyContent: "center", flexDirection: "column" }}>
            <ChatList />
            {location?.state?.errorMessage ? <p>{location.state.errorMessage}</p> : ""}
        </div>
    )
}

export default Chat;