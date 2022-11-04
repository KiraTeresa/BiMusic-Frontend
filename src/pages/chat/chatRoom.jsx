import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/auth.context"
import apiClient from "../../services/apiClient";
import Loading from '../../components/Loading/Loading';
import ChatMemberCard from "../../components/Chat/ChatMemberCard";
import ChatList from "../../components/Chat/ChatList";
// import ChatMessage from "../../components/Chat/ChatMessage";
import './chat.scss'
import io from "socket.io-client"
import ChatWindow from "../../components/Chat/ChatWindow";

function ChatRoom() {
    const { user } = useAuth() // <-- returns logged-in user (_id, email, name)
    const { chatId } = useParams()
    const [projectInfo, setProjectInfo] = useState({})
    const [dbHistory, setDbHistory] = useState([])
    const [message, setMessage] = useState({})
    const [msgHistory, setMsgHistory] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [chatClient, setChatClient] = useState(null)
    const [allUnreadMessages, setAllUnreadMessages] = useState([])
    const navigate = useNavigate()
    const msgRef = useRef()
    // const newMessage = {author: "currentUserId", msg: "", time: new Date()}
    // console.log("Chat Id: ", chatId)
    // console.log("Project ", projectInfo)
    // console.log("ref- ", msgRef)

    useEffect(() => {
        apiClient.get('/message/unread').then((result) => {
            console.log("Unreaaaaaad --> ", result.data)
            setAllUnreadMessages(result.data)
        }).catch((err) => console.log(err))
    }, [chatId])

    useEffect(() => {
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


    useEffect(() => {
        // get chat info:
        apiClient.get(`/chats/${chatId}`).then((result) => {
            const { initiator, collaborators } = result.data.project
            const collabs = collaborators.map((collab) => { return collab._id })
            const chatMembers = [initiator._id, ...collabs]
            setProjectInfo(result.data.project)

            const { history } = result.data
            const clearedHistory = []
            for (const msg of history) {
                if (msg.author) {
                    clearedHistory.push(msg)
                } else {
                    clearedHistory.push({ ...msg, author: { name: "deleted user" } })
                }
            }
            setDbHistory(clearedHistory)
            setMsgHistory([]) // necessary, otherwise msg would be shown in every room user jumps in afterwards (untill page refresh)
            setMessage({ msg: "", user: user.name, userId: user._id, chat: chatId, sendTo: chatMembers })
        }).catch((err) => {
            const errorDescription = err.response.data.message;
            navigate("/chats", { state: { errorMessage: errorDescription } })
            msgRef.current.scrollIntoView({ behavior: "smooth" })
        }).finally(() => setIsLoading(false))
    }, [chatId, user._id, user.name, navigate])

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

    setTimeout(() => {
        // set all messages of this chat as "read" for the current user
        // timeout needed, in order to highlight unread messages
        apiClient.put(`/message/read-all/${chatId}`).then((result) => console.log("Answer from backend: ", result.data)).catch((err) => console.error(err))
    }, 2000)


    return (
        <div className="container">
            <div className="chat-title">
                <h4>Your chatrooms {allUnreadMessages.length === 0 ? "" : <span className='msg-counter newMsg'>{allUnreadMessages.length}</span>}</h4>
                <h2>Chatroom: {projectInfo.title}</h2>
                <h4>Chat members</h4>
            </div>
            <div className="chat-container">
                <aside>
                    <ChatList currentChat={chatId} />
                </aside>
                <main>
                    <div className="chat-window-wrapper">
                        <ChatWindow chatInfo={{ dbHistory, msgHistory }} />
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