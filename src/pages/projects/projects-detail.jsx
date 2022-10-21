import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import apiClient from "../../services/apiClient";
import Loading from '../../components/Loading/Loading';
import commentIcon from '../../assets/icons/100.png'
import contributorsIcon from '../../assets/icons/24.png'
import sampleIcon from '../../assets/icons/71.png'

function ProjectDetail() {
    const [project, setProject] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const { projectId } = useParams();

    console.log("ID --> ", projectId)

    useEffect(() => {
        apiClient.get(`/projects/${projectId}`).then((result) => {
            setProject(result)
        }).catch((err) => console.log("No Project details received ", err)).finally(() => setIsLoading(false))
    }, [projectId])

    if (isLoading) {
        return <Loading />
    }

    console.log("Details--> ", project.data)
    const { _id, title, shortDescription, longDescription, genre, lookingFor, startDate, endDate, isRemote, city, country, initiator, collaborators, pendingCollabs, comments, sample } = project.data;

    return (
        <div className="project-detail-wrapper">
            <div className="project-detail">
                <div className="participants">
                    <div>
                        <h3>{initiator.name}</h3>
                        <img src={initiator.avatar ? initiator.avatar : "https://upload.wikimedia.org/wikipedia/commons/3/3f/Placeholder_view_vector.svg"} alt="user avatar" />
                    </div>

                    <div className="collaborators">
                        <h4>Collaborators:</h4>
                        {collaborators.map((collab) => {
                            // TO DO: populate collabs
                            return (<div key={collab._id}>
                                <h3>{collab.name}</h3>
                                <img src={collab.avatar ? collab.avatar : "https://upload.wikimedia.org/wikipedia/commons/3/3f/Placeholder_view_vector.svg"} alt="user avatar" />
                            </div>)
                        })}
                        {pendingCollabs.map((collab) => {
                            // TO DO: populate pending collabs
                            // Should only be visible for initiator + buttons to accept or deny
                            return (<div key={collab._id}>
                                <h3>{collab.name}</h3>
                                <img src={collab.avatar ? collab.avatar : "https://upload.wikimedia.org/wikipedia/commons/3/3f/Placeholder_view_vector.svg"} alt="user avatar" />
                            </div>)
                        })}
                    </div>
                </div>
                <div className="main">
                    <div className="description">
                        <h2>{title}</h2>
                        <p>{shortDescription}</p>
                        <p>{longDescription}</p>
                        {/* TO DO: path to add user to pending list */}
                        <Link to=""><button>join</button></Link>
                    </div>
                    <div className="comment-wrapper">
                        <div className="comments">
                            <img className="icon" src={commentIcon} alt="comment icon" />{comments ? comments.length : "0"}
                            <div>
                                {comments.map((comment) => {
                                    return (
                                        // TODO: populate comments
                                        // MAYBE OWN COMPONENT ??
                                        <div>{comment.text}</div>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="sample">
                            {/* TODO: populate sample */}
                            <img className={`icon ${!sample ? "grayout" : ""}`} src={sampleIcon} alt="sample icon" />
                        </div>
                    </div>
                </div>
                <div className="aside">
                    <div className="item-wrapper">
                        {genre.map((g) => {
                            return <p className='genre' key={g}>{g}</p>
                        })}
                    </div>
                    <div className="item-wrapper">
                        {lookingFor.map((skill) => {
                            return <p className='skill' key={skill}>{skill}</p>
                        })}
                    </div>
                    <div>
                        <p>Start: {startDate.slice(0, -14)}</p>
                        <p>End: {endDate.slice(0, -14)}</p>
                    </div>
                    <div>
                        <p>Where?</p>
                        <p className='location'>{isRemote ? "online" : (city + ", " + country)}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProjectDetail;