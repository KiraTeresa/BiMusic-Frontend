import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../services/apiClient";

function ChatLinkCard({ chatInfo }) {
    const { chat, currentChat } = chatInfo
    const { _id, project } = chat
    const [unreadMsg, setUnreadMsg] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        apiClient.get(`/message/unread/${_id}`).then((unreadMsgArr) => {
            setUnreadMsg(unreadMsgArr.data)
        }).catch((err) => {
            if (err.response.status === 500) {
                navigate('/internal-server-error')
            } else console.log(err)
        })
    }, [_id, currentChat, navigate])

    function goToChatroom() {
        navigate(`/chats/${_id}`)
    }

    return (
        <div className="chat-link" onClick={goToChatroom}>
            <div>
                {project.title}
            </div>
            <div className={`msg-counter ${unreadMsg.length > 0 ? "newMsg" : "noMsg"}`}>{unreadMsg.length}</div>
        </div>
    )
}

export default ChatLinkCard;