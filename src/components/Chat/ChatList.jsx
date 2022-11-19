import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../services/apiClient";
import Loading from "../Loading/Loading"
import ChatLinkCard from "./ChatLinkCard";

function ChatList({ currentChat }) {
    const [isLoading, setIsLoading] = useState(true);
    const [usersProjects, setUsersProjects] = useState([])
    const [usersChats, setUsersChats] = useState([])
    const [newChat, setNewChat] = useState({})
    const [errorMessage, setErrorMessage] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        apiClient.get("/chats").then((result) => {
            const { allProjects, existingChats } = result.data
            setUsersProjects(allProjects)
            setUsersChats(existingChats)
            setErrorMessage("")
        }).catch((err) => {
            if (err.response.status === 500) {
                navigate('/internal-server-error')
            } else { console.log(err) }
        }).finally(() => setIsLoading(false))
    }, [currentChat, navigate]) // needs this dependency to trigger update of unread messages

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

            <form className="filter" onSubmit={createNewChat}>
                <select name="project" onChange={handleChange}>
                    <option value="">-- choose the project --</option>
                    {usersProjects.map((proj) => {
                        return <option key={proj._id} value={proj._id}>{proj.title}</option>
                    })}
                </select>
                <button className={`btn ${currentChat ? 'tertiary' : 'primary'}`} type="submit">create new room</button>
            </form>

            {errorMessage ? <div className="error-message">{errorMessage}</div> : ""}
        </div>
    )
}

export default ChatList;