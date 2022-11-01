import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../../services/apiClient";
import Loading from '../../components/Loading/Loading';

function ChatList() {
    const [isLoading, setIsLoading] = useState(true);
    const [usersProjects, setUsersProjects] = useState([])
    const [usersChats, setUsersChats] = useState([])
    const [newChat, setNewChat] = useState({})
    const [errorMessage, setErrorMessage] = useState("")
    const navigate = useNavigate()

    console.log("Projects: ", usersProjects)
    console.log("Chats: ", usersChats)

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

    async function createNewChat(e) {
        e.preventDefault()

        await apiClient.post("/chats", { newChat }).then((result) => {
            console.log("Chat created ", result)
            const createdChat = result.data
            console.log("Created chaaaaat ", createdChat)
            // const newChatList = { ...usersChats, createdChat }
            setUsersChats([...usersChats, result.data])
            setNewChat({})
            // navigate(`/chats/${result.data._id}`)
        }).catch((err) => setErrorMessage(err.response.data.message))

    }

    if (isLoading) {
        return <Loading />
    }

    // console.log("Here ", usersProjects)
    // console.log("Selected proj: ", newChat)

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <h5>Your chatrooms</h5>
            {usersChats.map((chat) => {
                return <Link to={`/chats/${chat._id}`} key={chat._id}><button>{chat.project.title}</button></Link>
            })}
            <hr></hr>
            <p>Create a chat for another project:</p>
            <form onSubmit={createNewChat}>
                <select name="project" onChange={handleChange} style={{ maxWidth: "300px" }}>
                    <option value="">-- choose the project --</option>
                    {usersProjects.map((proj) => {
                        return <option key={proj._id} value={proj._id}>{proj.title}</option>
                    })}
                </select>
                <button type="submit" style={{ backgroundColor: "#63A18F" }}>create new room</button>
            </form>
            {errorMessage ? <div>{errorMessage}</div> : ""}
        </div>
    )
}

export default ChatList;