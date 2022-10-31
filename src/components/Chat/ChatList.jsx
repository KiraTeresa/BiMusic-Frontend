import { useEffect, useState } from "react";
import apiClient from "../../services/apiClient";
import Loading from '../../components/Loading/Loading';
import { Link } from "react-router-dom"

function ChatList() {
    const [isLoading, setIsLoading] = useState(true);
    const [usersProjects, setUsersProjects] = useState([])
    const [usersChats, setUsersChats] = useState([])
    const [newChat, setNewChat] = useState({})

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

    if (isLoading) {
        return <Loading />
    }

    // console.log("Here ", usersProjects)
    console.log("Selected proj: ", newChat)

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <h5>Your chatrooms</h5>
            {usersChats.map((chat) => {
                return <Link to={`/chats/${chat._id}`} key={chat._id}><button>{chat.project.title}</button></Link>
            })}
            <hr></hr>
            <p>Create a chat for another project:</p>
            <form onSubmit={createNewChat}>
                <select name="project" onChange={handleChange}>
                    <option value="">-- choose the project --</option>
                    {usersProjects.map((proj) => {
                        return <option key={proj._id} value={proj._id}>{proj.title}</option>
                    })}
                </select>
                <button type="submit" style={{ backgroundColor: "#63A18F" }}>create new room</button>
            </form>
        </div>
    )
}

export default ChatList;