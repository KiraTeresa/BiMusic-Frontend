import ChatMessage from "../../components/Chat/ChatMessage";
import { useAuth } from "../../context/auth.context"

function ChatWindow({ chatInfo }) {
    const { user } = useAuth()
    const { dbHistory, msgHistory } = chatInfo
    console.log("History db: ", dbHistory)
    console.log("History msg: ", msgHistory)

    return (
        <div className="chat-window">
            {
                dbHistory.length > 0 ?
                    dbHistory.map((element) => {
                        const msgRead = element.readBy?.includes(user._id)
                        return <ChatMessage key={element._id} msgInfo={{ name: element.author.name, msg: element.text, time: element.createdAt, msgRead }} />
                    })
                    : ""}
            {
                msgHistory.length > 0 ?
                    msgHistory.map((element, index) => {
                        const msgRead = element.readBy?.includes(user._id)
                        return <ChatMessage key={index} msgInfo={{ name: element.user, msg: element.msg, time: element.time, msgRead }} />
                    })
                    : ""
            }
        </div>
    )
}

export default ChatWindow