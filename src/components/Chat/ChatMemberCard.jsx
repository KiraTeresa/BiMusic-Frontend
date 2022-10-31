function ChatMemberCard({ userInfo }) {
    const { name, avatar } = userInfo

    return (
        <div style={{ display: "flex", gap: "5px" }}>
            <div style={{ height: "50px", width: "50px" }} >
                <img src={avatar ? avatar : "https://upload.wikimedia.org/wikipedia/commons/3/3f/Placeholder_view_vector.svg"} alt="user avatar" style={{ height: "100%", maxWidth: "100%" }} /></div>

            <p>{name}</p>
        </div>
    )
}

export default ChatMemberCard;