import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import apiClient from "../../services/apiClient";
import Loading from '../../components/Loading/Loading';
import { useAuth } from "../../context/auth.context";
import commentIcon from '../../assets/icons/100.png'
import contributorsIcon from '../../assets/icons/24.png'
import sampleIcon from '../../assets/icons/71.png'
import { set } from "date-fns";

function ProjectDetail() {
    const { user } = useAuth() // <-- returns logged-in user (_id, email, name) << useEffect??
    console.log("USER INFO --> ", user)
    const [project, setProject] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const { projectId } = useParams();
    const [alreadyCollab, setAlreadyCollab] = useState(false)
    const [alreadyPending, setAlreadyPending] = useState(false)
    const [userIsInitiator, setUserIsInitiator] = useState(false)

    console.log("ID --> ", projectId)

    useEffect(() => {
        apiClient.get(`/projects/${projectId}`).then((result) => {
            console.log("Res from server: ", result)

            const isCollab = result.data.collaborators.find((e) => e === user._id)
            if (isCollab) {
                setAlreadyCollab(true)
                console.log("Is collab ", isCollab)
            }

            const isPending = result.data.pendingCollabs.find((e) => e === user._id)
            if (isPending) {
                setAlreadyPending(true)
                console.log("Is pending ", isPending)
            }

            if (result.data.initiator._id === user._id) {
                setUserIsInitiator(true)
            }
            setProject(result)
        }).catch((err) => console.log("No Project details received ", err)).finally(() => setIsLoading(false))
    }, [projectId])

    async function triggerJoinLeave() {
        await apiClient.post(`/projects/${projectId}/${user._id}`).then((result) => {
            console.log("Backend responded: ", result)
        }).catch((err) => console.log("Error: ", err))

        if (alreadyCollab) {
            setAlreadyCollab(false)
        }

        if (alreadyPending) {
            setAlreadyPending(false)
        }

        if (!userIsInitiator && !alreadyCollab && !alreadyPending) {
            setAlreadyPending(true)
        }
    }

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
                        {alreadyCollab ? <button onClick={triggerJoinLeave}>leave collab</button> : ""}
                        {alreadyPending ? <div><p>You are on the pending list</p><button onClick={triggerJoinLeave}>don't care anymore, remove me from that list</button></div> : ""}
                    </div>
                </div>
                <div className="main">
                    <div className="description">
                        <h2>{title}</h2>
                        <p>{shortDescription}</p>
                        <p>{longDescription}</p>
                        {alreadyCollab ? "" : alreadyPending ? "" : userIsInitiator ? "" : <button onClick={triggerJoinLeave}>join</button>}
                    </div>
                    <div className="comment-wrapper">
                        <div className="comments">
                            <img className="icon" src={commentIcon} alt="comment icon" />{comments ? comments.length : "0"}
                            <div>
                                {comments.map((comment) => {
                                    return (
                                        // TODO: populate comments
                                        // MAYBE OWN COMPONENT ??
                                        <div key={comment._id}>{comment.text}</div>
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