import { useEffect, useState } from "react"
import apiClient from "../../services/apiClient"
import Loading from "../Loading/Loading"
import { formatDistanceToNow } from "date-fns";

function CommentCard({ commentInfo }) {
    // console.log("C--> ", commentInfo)
    const { author, text, createdAt } = commentInfo
    const [authorName, setAuthorName] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const distance = formatDistanceToNow(new Date(createdAt))

    useEffect(() => {
        apiClient.get(`/comment/${author}`).then((result) => setAuthorName(result.data)).catch((err) => console.log("ERROR ", err)).finally(() => setIsLoading(false))
    }, [author])

    if (isLoading) {
        return <Loading />
    }

    return (
        <div style={{ border: "2px green dashed", width: "50%", }}>
            <p><strong>{authorName}</strong> commented {distance} ago:</p>
            <div style={{ minHeight: "50px" }}><i>{text}</i></div>
        </div>
    )
}

export default CommentCard