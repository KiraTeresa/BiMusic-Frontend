import { formatRelative } from "date-fns"
import { useAuth } from "../../context/auth.context"

function ChatMessage({ msgInfo }) {
    const { user } = useAuth()
    const { name, msg, time, msgRead } = msgInfo
    const today = new Date()
    const date = formatRelative(new Date(time), today)

    return (
        <div className={`chat-message 
            ${name === user.name ? "right" : name === "deleted user" ? "left deleted" : "left"}
            ${msgRead ? "" : "unreadMsg"}
            `}>
            <p className="msg-author" style={{ margin: "0", fontWeight: "bold" }}>{name}</p>
            <p className="msg-text" style={{ margin: "0" }}>{msg}</p>
            <p className="msg-date">{date}</p>
        </div>
    )
}

export default ChatMessage;