import ChatMessage from "../../components/Chat/ChatMessage";
import { useAuth } from "../../context/auth.context"

function ChatWindow({ chatInfo }) {
    const { user } = useAuth()
    const { dbHistory, msgHistory } = chatInfo

    return (
        <div className="chat-window">
            {
                dbHistory.length > 0 ?
                    dbHistory.map((element) => {
                        return <ChatMessage key={element._id} msgInfo={{ name: element.author.name, msg: element.text, time: element.createdAt, msgRead: element.readBy?.includes(user._id) }} />
                    })
                    : ""}
            {
                msgHistory.length > 0 ?
                    msgHistory.map((element, index) => {
                        return <ChatMessage key={index} msgInfo={{ name: element.user, msg: element.msg, time: element.time, msgRead: element.readBy?.includes(user._id) }} />
                    })
                    : ""
            }
        </div>
    )
}

export default ChatWindow