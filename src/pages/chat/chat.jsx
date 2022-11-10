import { useLocation } from "react-router-dom"
import ChatList from "../../components/Chat/ChatList";

function Chat() {
    const location = useLocation();

    return (
        <div className="chat-list-container">
            <ChatList />
            {location?.state?.errorMessage ? <p className="error-message">{location.state.errorMessage}</p> : ""}
        </div>
    )
}

export default Chat;