import { useEffect, useState, useMemo, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/auth.context"
import apiClient from "../../services/apiClient";
import Loading from '../../components/Loading/Loading';
import ChatMemberCard from "../../components/Chat/ChatMemberCard";
import ChatList from "../../components/Chat/ChatList";
import ChatMessage from "../../components/Chat/ChatMessage";

function ChatRoom() {
    const { user } = useAuth() // <-- returns logged-in user (_id, email, name)
    const { chatId } = useParams()
    const [projectInfo, setProjectInfo] = useState({})
    const [dbHistory, setDbHistory] = useState([])
    const [message, setMessage] = useState({})
    const [msgHistory, setMsgHistory] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const ws = useMemo(() => new WebSocket("ws://localhost:8082"), [])
    const navigate = useNavigate()
    const msgRef = useRef()
    // const newMessage = {author: "currentUserId", msg: "", time: new Date()}
    // console.log("Chat Id: ", chatId)
    // console.log("Project ", projectInfo)
    console.log("ref- ", msgRef)

    useEffect(() => {
        console.log("Frontend welcomes you in the chat.")

        // connect to wsServer:
        ws.addEventListener("open", () => {
            console.log("We are connected")
        })
    }, [ws])

    useEffect(() => {
        apiClient.get(`/chats/${chatId}`).then((result) => {
            console.log("Chat room: you are logged in ", result)
            setProjectInfo(result.data.project)
            setDbHistory(result.data.history)
            setMessage({ msg: "", user: user.name, userId: user._id, chat: chatId })
        }).catch((err) => {
            const errorDescription = err.response.data.message;
            navigate("/chats", { state: { errorMessage: errorDescription } })
            msgRef.current.scrollIntoView({ behavior: "smooth" }) // TO DO: div doesn't exist at first render, that's why messages aren't scrolled <<<< fix??
        }).finally(() => setIsLoading(false))
    }, [chatId, user._id, user.name, navigate])

    function handleChange(e) {
        setMessage({ ...message, msg: e.target.value, time: new Date() })
    }

    async function sendMessage(e) {
        e.preventDefault()
        ws.send(JSON.stringify(message))
        console.log("Message sent ", message.msg)

        await apiClient.post("/message", message).then(() => console.log("Added your message to collection.")).catch(() => console.log("Couldn't add your msg to collection --- "))

        setMessage({ ...message, msg: "" })
        msgRef.current.scrollIntoView({ behavior: "smooth" })
    }


    ws.addEventListener("message", e => {
        const dataFromServer = JSON.parse(e.data)
        console.log("We received a message: ", dataFromServer)
        setMsgHistory([...msgHistory, dataFromServer])
    })

    ws.addEventListener("close", e => {
        console.log("Leaving the chatroom")
    })

    // window.onunload = function () {
    //     ws.close()
    // }

    if (isLoading) {
        return <Loading />
    }

    return (
        <div>
            <h2>Chatroom: {projectInfo.title}</h2>
            <div style={{ display: "flex", justifyContent: "center", gap: "100px" }}>
                <aside>
                    <ChatList />
                    {/* <Link to="/chats"><button>back</button></Link> */}
                </aside>
                <div>
                    <div id="chat-window" style={{ display: "flex", flexDirection: "column", height: "400px", overflowY: "auto" }}>
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
                        <div ref={msgRef}></div>
                    </div>
                    <form onSubmit={sendMessage}>
                        <input type="text" name="msg" onChange={handleChange} value={message.msg}></input>
                        <button>send msg</button>
                    </form>
                </div>
                <div>
                    <h4>Chat members</h4>
                    <ChatMemberCard userInfo={projectInfo.initiator} />
                    {projectInfo.collaborators.length > 0 ? "" : <p>-- this project has no collabs --</p>}
                    {projectInfo.collaborators.map((collab) => {
                        return <ChatMemberCard key={collab._id} userInfo={collab} />
                    })}
                </div>
            </div>
        </div>
    )
}

export default ChatRoom;