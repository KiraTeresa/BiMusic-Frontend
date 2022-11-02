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
    console.log("ref- ", msgRef)

    useEffect(() => {
        console.log("Frontend welcomes you in the chat.")
        console.log("Already ws? ---- ", chatClient?.connected)

        // if (!chatClient?.connected) {
        const socket = io("ws://localhost:5005")
        socket.on('connect', () => {
            console.log(">>> Connected to the chat >>>")
            socket.emit('join', `room-${chatId}`)
        })

        // socket.on('send', (data) => {
        //     console.log("Look what we got here >> ", data, " <<")
        // })


        setChatClient(socket)

        return () => {
            socket.off('connect');
            socket.off('disconnect')
            socket.disconnect()

        }
        // connect to wsServer:
        // ws.addEventListener("open", () => {
        //     console.log("We are connected ", ws)
        // })
        // } else {
        //     console.log(" ---___ already connected ___--- ")
        // }
    }, [chatId])
    console.log("Client: ", chatClient)

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
            msgRef.current.scrollIntoView({ behavior: "smooth" }) // TO DO: div doesn't exist at first render, that's why messages aren't scrolled <<<< fix??
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
        // e.preventDefault()
        chatClient.emit('send', message)
        // chatClient.send(JSON.stringify(message))
        console.log("Message sent ", message.msg)

        await apiClient.post("/message", message).then(() => console.log("Added your message to collection.")).catch(() => console.log("Couldn't add your msg to collection --- "))

        setMessage({ ...message, msg: "" })
        msgRef.current.scrollIntoView({ behavior: "smooth" })
    }

    if (chatClient?.connected) {
        chatClient.on('send', (data) => {
            console.log("Look what we got here >> ", data, " <<")
            if (chatId === data.chat) {
                setMsgHistory([...msgHistory, data])
            }
        })
    }

    if (isLoading) {
        return <Loading />
    }

    return (
        <div className="container">
            <div className="chat-title"><h2>Chatroom: {projectInfo.title}</h2></div>
            <div className="chat-container">
                <aside>
                    <ChatList />
                    {/* <Link to="/chats"><button>back</button></Link> */}
                </aside>
                <main>
                    <div id="chat-window">
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
                        <button onClick={sendMessage}>send</button>
                    </div>
                </main>
                <aside>
                    <h4>Chat members</h4>
                    <ChatMemberCard userInfo={projectInfo.initiator} />
                    {projectInfo.collaborators.length > 0 ? "" : <p>-- this project has no collabs --</p>}
                    {projectInfo.collaborators.map((collab) => {
                        return <ChatMemberCard key={collab._id} userInfo={collab} />
                    })}
                </aside>
            </div>
        </div>
    )
}

export default ChatRoom;