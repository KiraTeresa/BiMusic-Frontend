import { useEffect, useState } from "react"
import apiClient from "../../services/apiClient"
import Loading from "../Loading/Loading"

function CommentCard({ commentInfo }) {
    console.log("C--> ", commentInfo)
    const { author, text, createdAt } = commentInfo
    const [authorName, setAuthorName] = useState({})
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        apiClient.get(`/comment/${author}`).then((result) => setAuthorName(result.data)).catch((err) => console.log("ERROR ", err)).finally(() => setIsLoading(false))
    })

    if (isLoading) {
        return <Loading />
    }

    return (
        <div style={{ border: "2px green dashed" }}>
            <h4>{authorName}</h4>
            <div>{text}</div>
            <p>{createdAt}</p>
        </div>
    )
}

export default CommentCard