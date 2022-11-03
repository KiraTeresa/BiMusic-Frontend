import { useNavigate } from "react-router-dom";

function ChatMemberCard({ userInfo }) {
    const { _id, name, avatar, skills, status } = userInfo
    const navigate = useNavigate()

    const goToUserProfile = () => {
        navigate(`/profile/${_id}`)
    }

    return (
        <div onClick={goToUserProfile} className="chat-member-item">
            <div className="chat-member">
                <div className="avatar-wrapper">
                    <img src={avatar ? avatar : "https://upload.wikimedia.org/wikipedia/commons/3/3f/Placeholder_view_vector.svg"} alt="user avatar" />
                </div>
                <div className="name-wrapper">
                    <div className={`user-status ${status}`}></div>
                    <p>{name}</p>
                </div>
            </div>
            <div className="skills">
                {skills.map((skill) => {
                    return <p className="skill" key={skill}>{skill}</p>
                })}
            </div>
        </div>
    )
}

export default ChatMemberCard;