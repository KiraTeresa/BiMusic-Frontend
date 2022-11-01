import { formatRelative } from "date-fns"

function ChatMessage({ msgInfo }) {
    const { name, msg, time, currentUser } = msgInfo
    const today = new Date()
    const date = formatRelative(new Date(time), today)
    console.log("DATE>>> ", date)
    console.log("MSG ", msgInfo)

    return (
        <div style={name === currentUser ?
            { width: "150px", backgroundColor: "#63A18F", alignSelf: "flex-end", textAlign: "end", padding: "5px" }
            :
            { width: "150px", backgroundColor: "grey", alignSelf: "flex-start", textAlign: "start", padding: "5px" }}
        >
            <p style={{ margin: "0", fontWeight: "bold" }}>{name}</p>
            <p style={{ margin: "0" }}>{msg}</p>
            <p>{date}</p>
        </div>
    )
}

export default ChatMessage;