import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/auth.context"
import apiClient from "../../services/apiClient";
import Loading from '../../components/Loading/Loading';
import ChatMemberCard from "../../components/Chat/ChatMemberCard";
import ChatList from "../../components/Chat/ChatList";
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
    const [errorMessage, setErrorMessage] = useState("")
    const navigate = useNavigate()
    const msgRef = useRef()

    // get num of all unread messages for this user
    useEffect(() => {
        apiClient.get('/message/unread').then((result) => {
            setAllUnreadMessages(result.data)
            console.log("Hello", result)
        }).catch((err) => {
            if (err.response.status === 500) {
                navigate('/internal-server-error')
            } else {
                console.log(err)
            }
        })
    }, [chatId])

    // connect to socket server
    useEffect(() => {
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


    // get chat info
    useEffect(() => {
        apiClient.get(`/chats/${chatId}`).then((result) => {
            const { chatFound, usersHistory } = result.data
            setErrorMessage("")

            // set info of related project:
            setProjectInfo(chatFound.project)

            // set users history for this chat:
            setDbHistory(usersHistory)

            // get all chat members, to make messages be send to them:
            const { initiator, collaborators } = chatFound.project
            const collabs = collaborators.map((collab) => { return collab._id })
            const chatMembers = [initiator._id, ...collabs]

            // set message structure:
            setMessage({ msg: "", user: user.name, userId: user._id, chat: chatId, sendTo: chatMembers })

            // clear socket related history when switching rooms, otherwise msg from former room will also be visible here:
            setMsgHistory([])

        }).catch((err) => {
            if (err.response.status === 500) {
                navigate('/internal-server-error')
            } else {
                const errorDescription = err.response.data.message;
                navigate("/chats", { state: { errorMessage: errorDescription } })
                msgRef.current.scrollIntoView({ behavior: "smooth" })
            }
        }).finally(() => setIsLoading(false))
    }, [chatId, user._id, user.name, navigate])


    // auto scroll to latest msg on first render and after every new message
    useEffect(() => {
        if (chatClient?.connected) {
            msgRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [msgHistory, chatClient?.connected])


    function handleChange(e) {
        setMessage({ ...message, msg: e.target.value, time: new Date() })
    }

    async function sendMessage() {
        if (message.msg) {
            await apiClient.post("/message", message).then((result) => {
                chatClient.emit('send', { ...message, msgId: result.data._id })
            }).catch((err) => {
                if (err.response.status === 500) {
                    navigate('/internal-server-error')
                } else { setErrorMessage(err.response.data.message) }
            })

                (() => console.log("Couldn't add your msg to collection --- "))
            setMessage({ ...message, msg: "" })
        }
    }

    // receiving data (new message) from socket server
    if (chatClient?.connected) {
        chatClient.on('send', async (data) => {
            if (chatId === data.chat) {
                setMsgHistory([...msgHistory, data])
            }

            // set new message as read for all users who are currently in this chatroom:
            await apiClient.put(`/message/read-one/${data.msgId}`).then(() => console.log("Newly received message was set as read.")).catch((err) => console.log(err))
        })
    }

    if (isLoading) {
        return <Loading />
    }

    setTimeout(() => {
        // set all messages of this chat as "read" for the current user
        // timeout needed, in order to highlight unread messages
        apiClient.put(`/message/read-all/${chatId}`).then((result) => console.log(result.data)).catch((err) => console.log(err))
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
                        <button onClick={sendMessage} className="btn primary">send</button>
                    </div>
                    {errorMessage ? <div className="error-message">{errorMessage}</div> : ""}
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