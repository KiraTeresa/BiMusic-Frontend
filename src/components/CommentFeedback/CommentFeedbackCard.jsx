import { formatDistanceToNow } from "date-fns";

function CommentFeedbackCard({ commentInfo }) {
    const { author, text, createdAt } = commentInfo
    const distance = formatDistanceToNow(new Date(createdAt))

    return (
        <div style={{ border: "2px green dashed", width: "50%", }}>
            <p><strong>{author ? author.name : "deleted user"}</strong> commented {distance} ago:</p>
            <div style={{ minHeight: "50px" }}><i>{text}</i></div>
        </div>
    )
}

export default CommentFeedbackCard