import commentIcon from '../../assets/icons/100.png'
import contributorsIcon from '../../assets/icons/24.png'
import sampleIcon from '../../assets/icons/71.png'

function ProjectCard({ project }) {
    const { _id, title, shortDescription, genre, lookingFor, startDate, endDate, isRemote, city, country, initiator, collaborators, comments, sample } = project;

    return (
        <div className="project-card">
            <h3>{title}</h3>
            <p>{shortDescription}</p>
            <div className="initiator">
                <p>By: {initiator.name}</p>
                <img src={initiator.avatar ? initiator.avatar : "https://upload.wikimedia.org/wikipedia/commons/3/3f/Placeholder_view_vector.svg"} alt="user avatar" />
            </div>
            <div className="item-wrapper">
                {genre.map((g) => {
                    return <p key={g}>{g}</p>
                })}
            </div>
            <div className="item-wrapper">
                {lookingFor.map((skill) => {
                    return <p key={skill}>{skill}</p>
                })}
            </div>
            <div className="basic-info">
                <div>
                    <p>{startDate.slice(0, -14)} - {endDate.slice(0, -14)}</p>
                    <p className='location'>{isRemote ? "online" : (city + ", " + country)}</p>
                </div>
                <div className="interaction-wrapper">
                    <img className="icon" src={commentIcon} alt="comment icon" />{comments ? comments.length : "0"}
                    <img className="icon" src={contributorsIcon} alt="contributors icon" />{collaborators ? collaborators.length : "0"}
                    <img className={`icon ${!sample ? "grayout" : ""}`} src={sampleIcon} alt="sample icon" />
                </div>
            </div>
        </div>
    )
}

export default ProjectCard;