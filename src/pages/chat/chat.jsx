import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../context/auth.context"
import apiClient from "../../services/apiClient";
import Loading from '../../components/Loading/Loading';
import ChatRoom from "../../components/ChatRoom/ChatRoom";

function Chat() {
    const { user } = useAuth() // <-- returns logged-in user (_id, email, name)
    const [message, setMessage] = useState('')
    const [msgHistory, setMsgHistory] = useState([])
    const [activeChat, setActiveChat] = useState(undefined)
    const [isLoading, setIsLoading] = useState(true);
    const [usersProjects, setUsersProjects] = useState([])
    const [usersChats, setUsersChats] = useState([])
    const [newChat, setNewChat] = useState({})
    // const ws = useMemo(() => new WebSocket("ws://localhost:8082"), [])
    // const newMessage = {author: "currentUserId", msg: "", time: new Date()}

    // useEffect(() => {
    //     console.log("Frontend welcomes you in the chat.")

    //     // connect to wsServer:
    //     ws.addEventListener("open", () => {
    //         console.log("We are connected")
    //     })
    // }, [ws])

    useEffect(() => {
        // "login" to the chat:
        apiClient.get("/chats").then((result) => {
            // console.log("You are logged in to the chat room")
            const { allProjects, existingChats } = result.data
            console.log("Got this result from server: ", result.data)
            setUsersProjects(allProjects)
            setUsersChats(existingChats)
        }).catch(() => console.log("Could not log you in at the chat")).finally(() => setIsLoading(false))
    }, [])

    function handleChange(e) {
        const { value } = e.target
        setNewChat(value)
    }

    function createNewChat(e) {
        e.preventDefault()

        apiClient.post("/chats", { newChat }).then((result) => console.log("Chat created ", result)).catch(() => console.log("uups"))
    }

    function openChat(e) {
        setActiveChat(e.target.value)
    }

    if (isLoading) {
        return <Loading />
    }

    // console.log("Here ", usersProjects)
    console.log("Selected proj: ", newChat)

    return (
        <section style={{ display: "flex", justifyContent: "space-between", maxWidth: "1290px", margin: "auto" }}>
            <div style={{ display: "flex", flexDirection: "column", width: "200px" }}>
                <h5>Your chatrooms</h5>
                {usersChats.map((chat) => {
                    return <button key={chat._id} value={chat._id} onClick={openChat}>{chat.project.title}</button>
                })}
                <hr></hr>
                <p>Create a chat for another project:</p>
                <form onSubmit={createNewChat}>
                    <select name="project" onChange={handleChange}>
                        {usersProjects.map((proj) => {
                            return <option key={proj._id} value={proj._id}>{proj.title}</option>
                        })}
                    </select>
                    <button type="submit" style={{ backgroundColor: "#63A18F" }}>create new room</button>
                </form>
            </div>
            {activeChat ?
                <div>
                    <h2>Chat</h2>
                    <ChatRoom chatId={activeChat} />
                    <div>
                    </div>
                </div>
                : ""}
            <div style={{ display: "flex", width: "200px" }}>
                <h5>Chat members</h5>
            </div>
        </section>
    )
}

export default Chat;