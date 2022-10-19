import commentIcon from '../../assets/icons/100.png'
import contributorsIcon from '../../assets/icons/24.png'
import sampleIcon from '../../assets/icons/71.png'

function ProjectCard({ project }) {
    const { _id, title, shortDescription, genre, lookingFor, startDate, endDate, isRemote, city, country, collaborators, comments, sample } = project;

    return (
        <div style={{ border: "1px solid black", minWidth: "350px" }}>
            <h3>{title}</h3>
            <p>{shortDescription}</p>
            <div style={{ display: "flex", gap: "4px" }}>
                {genre.map((g) => {
                    return <p key={g} style={{ border: "grey 1px dashed" }}>{g}</p>
                })}
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: "4px" }}>
                {lookingFor.map((skill) => {
                    return <p key={skill} style={{ border: "blue 1px dashed" }}>{skill}</p>
                })}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "5px" }}>
                <div style={{ textAlign: "left" }}>
                    <p style={{ margin: "0" }}>{startDate.slice(0, -14)} - {endDate.slice(0, -14)}</p>
                    <p style={{ margin: "0" }}>{isRemote ? "online" : (city + ", " + country)}</p>
                </div>
                <div>
                    <img src={commentIcon} alt="comment icon" style={{ height: "30px" }} />{comments ? comments.length : "0"}
                    <img src={contributorsIcon} alt="contributors icon" style={{ height: "30px" }} />{collaborators ? collaborators.length : "0"}
                    {sample ? <img src={sampleIcon} alt="sample icon" style={{ height: "30px" }} /> : ""}
                </div>
            </div>
        </div>
    )
}

export default ProjectCard;