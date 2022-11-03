import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../services/apiClient";

function ChatLinkCard({ chatInfo }) {
    const { _id, project } = chatInfo
    const [unreadMsg, setUnreadMsg] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        apiClient.get(`/message/unread/${_id}`).then((unreadMsgArr) => {
            console.log("Unread: ", unreadMsgArr)
            setUnreadMsg(unreadMsgArr.data)
        }).catch((err) => console.log("Getting unread messages failed. ", err))
    }, [])

    function goToChatroom() {
        navigate(`/chats/${_id}`)
    }

    // console.log("Chat info --> ", chatInfo)

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