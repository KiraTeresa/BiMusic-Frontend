import { formatRelative } from "date-fns"

function ChatMessage({ msgInfo }) {
    const { name, msg, time, currentUser } = msgInfo
    const today = new Date()
    const date = formatRelative(new Date(time), today)
    // console.log("DATE>>> ", date)
    // console.log("MSG ", msgInfo)

    return (
        <div className={`chat-message ${name === currentUser ?
            "right" : "left"}`}>
            <p className="msg-author" style={{ margin: "0", fontWeight: "bold" }}>{name}</p>
            <p className="msg-text" style={{ margin: "0" }}>{msg}</p>
            <p className="msg-date">{date}</p>
        </div>
    )
}

export default ChatMessage;