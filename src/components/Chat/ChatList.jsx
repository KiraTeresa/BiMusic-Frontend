import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../services/apiClient";
import Loading from '../../components/Loading/Loading';

function ChatList() {
    const [isLoading, setIsLoading] = useState(true);
    const [usersProjects, setUsersProjects] = useState([])
    const [usersChats, setUsersChats] = useState([])
    const [newChat, setNewChat] = useState({})
    const [errorMessage, setErrorMessage] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        // "login" to the chat:
        apiClient.get("/chats").then((result) => {
            const { allProjects, existingChats } = result.data
            // console.log("Got this result from server: ", result.data)
            setUsersProjects(allProjects)
            setUsersChats(existingChats)
        }).catch(() => console.log("Could not log you in at the chat")).finally(() => setIsLoading(false))
    }, [])

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

    function goToChatroom(chat) {
        navigate(`/chats/${chat}`)
    }

    if (isLoading) {
        return <Loading />
    }

    // console.log("Here ", usersProjects)
    // console.log("Selected proj: ", newChat)

    return (
        <div className="chat-list">
            <div className="chat-link-wrapper">
                {usersChats.map((chat) => {
                    return <div className="chat-link" onClick={() => goToChatroom(chat._id)} key={chat._id}>{chat.project.title}</div>
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