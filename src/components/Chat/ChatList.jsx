import { useEffect, useState } from "react";
import apiClient from "../../services/apiClient";
import Loading from "../Loading/Loading"
import ChatLinkCard from "./ChatLinkCard";

function ChatList({ currentChat }) {
    const [isLoading, setIsLoading] = useState(true);
    const [usersProjects, setUsersProjects] = useState([])
    const [usersChats, setUsersChats] = useState([])
    const [newChat, setNewChat] = useState({})
    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
        apiClient.get("/chats").then((result) => {
            const { allProjects, existingChats } = result.data
            setUsersProjects(allProjects)
            setUsersChats(existingChats)
        }).catch(() => console.log("Could not log you in at the chat")).finally(() => setIsLoading(false))
    }, [currentChat]) // needs this dependency to trigger update of unread messages

    function handleChange(e) {
        const { value } = e.target
        setNewChat(value)
    }

    async function createNewChat(e) {
        e.preventDefault()

        await apiClient.post("/chats", { newChat }).then((result) => {
            setUsersChats([...usersChats, result.data])
            setNewChat({})
        }).catch((err) => setErrorMessage(err.response.data.message))
    }

    if (isLoading) {
        return <Loading />
    }

    return (
        <div className="chat-list">
            <div className="chat-link-wrapper">
                {usersChats.map((chat) => {
                    return <ChatLinkCard key={chat._id} chatInfo={{ chat, currentChat }} />
                })}
            </div>
            <form onSubmit={createNewChat}>
                <select name="project" onChange={handleChange} style={{ maxWidth: "300px" }}>
                    <option value="">-- choose the project --</option>
                    {usersProjects.map((proj) => {
                        return <option key={proj._id} value={proj._id}>{proj.title}</option>
                    })}
                </select>
                <button className="btn-secondary" type="submit">create new room</button>
            </form>
            {errorMessage ? <div className="error-message">{errorMessage}</div> : ""}
        </div>
    )
}

export default ChatList;