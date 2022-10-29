import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../context/auth.context"
import apiClient from "../../services/apiClient";
import Loading from '../../components/Loading/Loading';

function Chat() {
    const { user } = useAuth() // <-- returns logged-in user (_id, email, name)
    const [message, setMessage] = useState('')
    const [msgHistory, setMsgHistory] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const ws = useMemo(() => new WebSocket("ws://localhost:8082"), [])
    // const newMessage = {author: "currentUserId", msg: "", time: new Date()}

    useEffect(() => {
        console.log("Frontend welcomes you in the chat.")

        // connect to wsServer:
        ws.addEventListener("open", () => {
            console.log("We are connected")
        })
    }, [ws])

    useEffect(() => {
        // "login" to the chat:
        apiClient.get("/chats").then(() => console.log("You are logged in to the chat room")).catch(() => console.log("Could not log you in at the chat")).finally(() => setIsLoading(false))
    }, [])

    function handleChange(e) {
        // console.log("---> ", e.target.value)
        setMessage(e.target.value)
    }

    function handleSubmit(e) {
        e.preventDefault()
        ws.send(JSON.stringify({ msg: message, user: user.name }))
        console.log("Message sent ", message)
        setMessage("")
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
        <section>
            <h2>Chat</h2>
            <div>
                {msgHistory.length > 0 ?
                    msgHistory.map((element, index) => {
                        return <p key={index} style={{ backgroundColor: element.user === user.name ? "#63A18F" : "grey" }}><strong>{element.user}:</strong> {element.msg}</p>
                    })
                    : <p>... no messages ...</p>}
                <form onSubmit={handleSubmit}>
                    <input type="text" name="msg" onChange={handleChange} value={message}></input>
                    <button>send msg</button>
                </form>
            </div>
            <article>
                <h3>WebSocket Data</h3>
            </article>
        </section>
    )
}

export default Chat;