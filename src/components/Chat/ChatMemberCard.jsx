import { useNavigate } from "react-router-dom";

function ChatMemberCard({ userInfo }) {
    const { name, avatar, skills, status } = userInfo
    const navigate = useNavigate()

    const goToUserProfile = () => {
        navigate(`/profile/${name}`)
    }

    return (
        <div onClick={goToUserProfile} className="chat-member-item">
            <div className="chat-member">
                <div className="avatar-wrapper">
                    <img src={avatar} alt="user avatar" />
                </div>
                <div className="name-wrapper">
                    <p>{name}</p>
                    <div className={`user-status ${status}`}>{status}</div>
                </div>
            </div>
            {/* <div className="skills">
                {skills.map((skill) => {
                    return <p className="skill" key={skill}>{skill}</p>
                })}
            </div> */}
        </div>
    )
}

export default ChatMemberCard;