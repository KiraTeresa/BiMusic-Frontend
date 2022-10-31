import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../context/auth.context"
import apiClient from "../../services/apiClient";
import Loading from '../../components/Loading/Loading';
import ChatMemberCard from "./ChatMemberCard";

function ChatRoom({ chatId }) {
    const { user } = useAuth() // <-- returns logged-in user (_id, email, name)
    const [projectInfo, setProjectInfo] = useState({})
    const [dbHistory, setDbHistory] = useState([])
    const [message, setMessage] = useState({ msg: "", user: user.name, userId: user._id, chat: chatId })
    const [msgHistory, setMsgHistory] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const ws = useMemo(() => new WebSocket("ws://localhost:8082"), [])
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
        // go to the chatroom:
        apiClient.get(`/chats/${chatId}`).then((result) => {
            console.log("Chat room: you are logged in ", result)
            setProjectInfo(result.data.project)
            setDbHistory(result.data.history)
        }).catch(() => console.log("Could not log you in at the chat")).finally(() => setIsLoading(false))
    }, [])

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

    if (isLoading) {
        return <Loading />
    }

    return (
        <div style={{ display: "flex" }}>
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
                {projectInfo.collaborators.map((collab) => {
                    return <ChatMemberCard key={collab._id} userInfo={collab} />
                })}
            </div>
        </div>
    )
}

export default ChatRoom;