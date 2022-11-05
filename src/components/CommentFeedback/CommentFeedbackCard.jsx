import { formatDistanceToNow } from "date-fns";

function CommentFeedbackCard({ commentInfo }) {
    const { author, title, text, createdAt } = commentInfo
    const distance = formatDistanceToNow(new Date(createdAt))

    return (
        <div style={{ border: "2px green dashed", width: "50%", }}>
            <p><strong>{author ? author.name : "deleted user"}</strong> posted {distance} ago:</p>
            {title ? <h4>{title}</h4> : ""}
            <div style={{ minHeight: "50px" }}><i>{text}</i></div>
        </div>
    )
}

export default CommentFeedbackCard