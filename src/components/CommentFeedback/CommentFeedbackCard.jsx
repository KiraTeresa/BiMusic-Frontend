import './CommentFeedback.scss'
import { formatDistanceToNow } from "date-fns";

function CommentFeedbackCard({ commentInfo }) {
    const { author, title, text, createdAt } = commentInfo
    const distance = formatDistanceToNow(new Date(createdAt))

    return (
        <div className="speechbubble">
            <div className='gradient'>
            </div>
            {title ? <h5>{title}</h5> : ""}
            <div className='text'>{text}</div>
            <p>posted by <span className='author'>{author ? author.name : "deleted user"}</span> {distance} ago</p>
        </div>
    )
}

export default CommentFeedbackCard