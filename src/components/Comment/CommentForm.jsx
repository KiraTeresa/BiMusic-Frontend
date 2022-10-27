import { useState } from "react"
import { useParams } from "react-router-dom";
import apiClient from "../../services/apiClient";

function CommentForm() {
    const [commentText, setCommentText] = useState("")
    const { projectId } = useParams();

    function handleChange(e) {
        setCommentText(e.target.value)
    }

    function handleSubmit(e) {
        e.preventDefault();
        console.log("New Comment --> ", commentText)

        apiClient.post(`/comment/${projectId}`, { commentText }).then((res) => {
            console.log(res)
            setCommentText("")
        }).catch((err) => {
            console.log("Commenting failed ", err)
        })
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <textarea name="text" maxLength={500} value={commentText} onChange={handleChange}></textarea>
                <button type="submit">comment</button>
            </form>
        </div>
    )
}

export default CommentForm