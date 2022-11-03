import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/auth.context"
import apiClient from "../../services/apiClient";
import Loading from '../../components/Loading/Loading';
import ChatMemberCard from "../../components/Chat/ChatMemberCard";
import ChatList from "../../components/Chat/ChatList";
import ChatMessage from "../../components/Chat/ChatMessage";
import './chat.scss'
import io from "socket.io-client"

function ChatRoom() {
    const { user } = useAuth() // <-- returns logged-in user (_id, email, name)
    const { chatId } = useParams()
    const [projectInfo, setProjectInfo] = useState({})
    const [dbHistory, setDbHistory] = useState([])
    const [message, setMessage] = useState({})
    const [msgHistory, setMsgHistory] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [chatClient, setChatClient] = useState(null)
    const navigate = useNavigate()
    const msgRef = useRef()
    // const newMessage = {author: "currentUserId", msg: "", time: new Date()}
    // console.log("Chat Id: ", chatId)
    // console.log("Project ", projectInfo)
    // console.log("ref- ", msgRef)

    useEffect(() => {
        // console.log("Frontend welcomes you in the chat.")
        // console.log("Already ws? ---- ", chatClient?.connected)

        // connect to socket server:
        if (!chatClient?.connected) {
            const socket = io(process.env.REACT_APP_BACKEND_URL)
            socket.on('connect', () => {
                console.log(">>> Connected to the chat >>>")
                socket.emit('join', `room-${chatId}`)
            })

            setChatClient(socket)

            return () => {
                socket.off('connect');
                socket.off('disconnect')
                socket.disconnect()
            }

        } else {
            console.log(" --- already connected --- ")
        }
    }, [chatId])
    // console.log("Client: ", chatClient)

    useEffect(() => {
        apiClient.get(`/chats/${chatId}`).then((result) => {
            console.log("Chat room: you are logged in ", result)
            setProjectInfo(result.data.project)
            setDbHistory(result.data.history)
            setMsgHistory([]) // necessary, otherwise msg would be shown in every room user jumps in afterwards (untill page refresh)
            setMessage({ msg: "", user: user.name, userId: user._id, chat: chatId })
        }).catch((err) => {
            const errorDescription = err.response.data.message;
            navigate("/chats", { state: { errorMessage: errorDescription } })
            msgRef.current.scrollIntoView({ behavior: "smooth" })
        }).finally(() => setIsLoading(false))
    }, [chatId, user._id, user.name, navigate])

    useEffect(() => {
        // set all messages of this chat as "read"
        apiClient.put(`/message/read-all/${chatId}`).then((result) => console.log("Answer from backend: ", result.data)).catch((err) => console.error(err))
    }, [chatId])

    useEffect(() => {
        if (chatClient?.connected) {
            // auto scrolls to latest msg on first render and after every new message
            msgRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [msgHistory])

    function handleChange(e) {
        setMessage({ ...message, msg: e.target.value, time: new Date() })
    }

    async function sendMessage() {

        await apiClient.post("/message", message).then((result) => {
            console.log("Added your message to collection.", result.data._id)

            chatClient.emit('send', { ...message, msgId: result.data._id })
            console.log("Message sent ", message.msg)

        }).catch(() => console.log("Couldn't add your msg to collection --- "))

        setMessage({ ...message, msg: "" })
        msgRef.current.scrollIntoView({ behavior: "smooth" })
    }

    if (chatClient?.connected) {
        chatClient.on('send', async (data) => {
            // console.log("Look what we got here >> ", data, " <<")
            if (chatId === data.chat) {
                setMsgHistory([...msgHistory, data])
            }

            // set new message as read for all users who are currently in this chatroom
            await apiClient.put(`/message/read-one/${data.msgId}`).then(() => console.log("Newly received message was set as read.")).catch((err) => console.error(err))
        })
    }

    if (isLoading) {
        return <Loading />
    }

    return (
        <div className="container">
            <div className="chat-title">
                <h4>Your chatrooms</h4>
                <h2>Chatroom: {projectInfo.title}</h2>
                <h4>Chat members</h4>
            </div>
            <div className="chat-container">
                <aside>
                    <ChatList />
                </aside>
                <main>
                    <div className="chat-window">
                        {dbHistory.length > 0 ? dbHistory.map((element) => {
                            return <ChatMessage key={element._id} msgInfo={{ name: element.author.name, msg: element.text, time: element.createdAt, currentUser: user.name }} />
                        }) : ""}
                        {
                            msgHistory.length > 0 ?
                                msgHistory.map((element, index) => {
                                    return <ChatMessage key={index} msgInfo={{ name: element.user, msg: element.msg, time: element.time, currentUser: user.name }} />
                                })
                                : <p>... no new messages ...</p>
                        }
                        <div ref={msgRef} style={{ height: "20px" }}></div>
                    </div>
                    <div className="chat-form">
                        <textarea type="text" name="msg" onChange={handleChange} value={message.msg}></textarea>
                        <button onClick={sendMessage} className="btn-primary">send</button>
                    </div>
                </main>
                <aside>
                    <div className="chat-member-wrapper">
                        <ChatMemberCard userInfo={projectInfo.initiator} />
                        {projectInfo.collaborators.length > 0 ? "" : <p>-- this project has no collabs --</p>}
                        {projectInfo.collaborators.map((collab) => {
                            return <ChatMemberCard key={collab._id} userInfo={collab} />
                        })}
                    </div>
                </aside>
            </div>
        </div>
    )
}

export default ChatRoom;