import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/auth.context"
import apiClient from "../../services/apiClient";
import Loading from '../../components/Loading/Loading';
import ChatMemberCard from "../../components/Chat/ChatMemberCard";
import ChatList from "../../components/Chat/ChatList";

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
    // const newMessage = {author: "currentUserId", msg: "", time: new Date()}
    console.log("Chat Id: ", chatId)
    console.log("Project ", projectInfo)

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
        }).finally(() => setIsLoading(false))
    }, [chatId, user.name, user._id, navigate])

    function handleChange(e) {
        setMessage({ ...message, msg: e.target.value })
    }

    async function sendMessage(e) {
        e.preventDefault()
        ws.send(JSON.stringify(message))
        console.log("Message sent ", message.msg)

        await apiClient.post("/message", message).then(() => console.log("Added your message to collection.")).catch(() => console.log("Couldn't add your msg to collection --- "))

        setMessage({ ...message, msg: "" })
    }


    ws.addEventListener("message", e => {
        const dataFromServer = JSON.parse(e.data)
        console.log("We received a message: ", dataFromServer)
        setMsgHistory([...msgHistory, dataFromServer])
    })

    ws.addEventListener("close", e => {
        console.log("Leaving the chatroom")
    })

    window.onunload = function () {
        ws.close()
    }

    if (isLoading) {
        return <Loading />
    }

    return (
        <div style={{ display: "flex", justifyContent: "center", gap: "100px" }}>
            <aside>
                <ChatList />
            </aside>
            <div>
                <h2>Chatroom: {projectInfo.title}</h2>
                {dbHistory.length > 0 ? dbHistory.map((element) => {
                    return <p key={element._id} style={{ backgroundColor: element.author.name === user.name ? "#63A18F" : "grey" }}><strong>{element.author.name}:</strong> {element.text}</p>
                }) : ""}
                {msgHistory.length > 0 ?
                    msgHistory.map((element, index) => {
                        return <p key={index} style={{ backgroundColor: element.user === user.name ? "#63A18F" : "grey" }}><strong>{element.user}:</strong> {element.msg}</p>
                    })
                    : <p>... no new messages ...</p>}
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
    )
}

export default ChatRoom;