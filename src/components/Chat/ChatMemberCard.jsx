import { useNavigate } from "react-router-dom";

function ChatMemberCard({ userInfo }) {
    const { _id, name, avatar } = userInfo
    const navigate = useNavigate()

    const goToUserProfile = () => {
        navigate(`/profile/${_id}`)
    }

    return (
        <div onClick={goToUserProfile} className="chat-member">
            <div className="avatar-wrapper">
                <img src={avatar ? avatar : "https://upload.wikimedia.org/wikipedia/commons/3/3f/Placeholder_view_vector.svg"} alt="user avatar" />
            </div>

            <p>{name}</p>
        </div>
    )
}

export default ChatMemberCard;