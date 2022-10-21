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
    // console.log("USER INFO --> ", user)
    const [project, setProject] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const { projectId } = useParams();
    const [alreadyCollab, setAlreadyCollab] = useState(false)
    const [alreadyPending, setAlreadyPending] = useState(false)
    const [userIsInitiator, setUserIsInitiator] = useState(false)

    // console.log("ID --> ", projectId)

    useEffect(() => {
        apiClient.get(`/projects/${projectId}`).then(async (result) => {
            console.log("Res from server: ", result)

            const isCollab = await result.data.collaborators.find((e) => e._id === user._id)
            if (isCollab) {
                await setAlreadyCollab(true)
                console.log("Is collab ", isCollab)
            }

            const isPending = await result.data.pendingCollabs.find((e) => e._id === user._id)
            if (isPending) {
                await setAlreadyPending(true)
                console.log("Is pending ", isPending)
            }

            if (result.data.initiator._id === user._id) {
                await setUserIsInitiator(true)
            }
            setProject(result.data)
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

    async function handleUserRequest(e) {
        console.log("Event ", e.target)
        const { value, name } = e.target;
        await apiClient.post(`/projects/${projectId}/${value}/${name}`).then((result) => {
            console.log("Backend handled the user request: ", result)
        }).catch((err) => console.log("Error: ", err))
    }

    if (isLoading) {
        return <Loading />
    }

    console.log("WHO is WHO *********** ", alreadyCollab, " | ", alreadyPending, " | ", userIsInitiator)
    console.log("Details--> ", project.data)
    // const { _id, title, shortDescription, longDescription, genre, lookingFor, startDate, endDate, isRemote, city, country, initiator, collaborators, pendingCollabs, comments, sample } = project.data;

    return (
        <div className="project-detail-wrapper">
            <div className="project-detail">
                <div className="participants">
                    <div>
                        <h3>{project.initiator.name}</h3>
                        <img src={project.initiator.avatar ? project.initiator.avatar : "https://upload.wikimedia.org/wikipedia/commons/3/3f/Placeholder_view_vector.svg"} alt="user avatar" />
                    </div>

                    <div className="collaborators">
                        <h4>Collaborators:</h4>
                        {project.collaborators.map((collab) => {
                            // TO DO: doesn't map again when some one clicked button to join or leve
                            return (<div key={collab._id}>
                                <h3>{collab.name}</h3>
                                <img src={collab.avatar ? collab.avatar : "https://upload.wikimedia.org/wikipedia/commons/3/3f/Placeholder_view_vector.svg"} alt="user avatar" />
                            </div>)
                        })}
                        {userIsInitiator ? <div><h4>Pending:</h4>
                            {project.pendingCollabs.map((collab) => {
                                // TO DO: doesn't map again when some one clicked button to join or leve
                                return (<div key={collab._id}>
                                    <h3>{collab.name}</h3>
                                    <img src={collab.avatar ? collab.avatar : "https://upload.wikimedia.org/wikipedia/commons/3/3f/Placeholder_view_vector.svg"} alt="user avatar" />
                                    <button onClick={handleUserRequest} name="accept" value={collab._id}>Accept</button>
                                    <button onClick={handleUserRequest} name="reject" value={collab._id}>Reject</button>
                                </div>)
                            })}
                        </div> : ""}
                        {alreadyCollab ? <button onClick={triggerJoinLeave}>leave collab</button> : ""}
                        {alreadyPending ? <div><p>You are on the pending list</p><button onClick={triggerJoinLeave}>don't care anymore, remove me from that list</button></div> : ""}
                    </div>
                </div>
                <div className="main">
                    <div className="description">
                        <h2>{project.title}</h2>
                        <p>{project.shortDescription}</p>
                        <p>{project.longDescription}</p>
                        {alreadyCollab ? "" : alreadyPending ? "" : userIsInitiator ? "" : <button onClick={triggerJoinLeave}>join</button>}
                    </div>
                    <div className="comment-wrapper">
                        <div className="comments">
                            <img className="icon" src={commentIcon} alt="comment icon" />{project.comments ? project.comments.length : "0"}
                            <div>
                                {project.comments.map((comment) => {
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
                            <img className={`icon ${!project.sample ? "grayout" : ""}`} src={sampleIcon} alt="sample icon" />
                        </div>
                    </div>
                </div>
                <div className="aside">
                    <div className="item-wrapper">
                        {project.genre.map((g) => {
                            return <p className='genre' key={g}>{g}</p>
                        })}
                    </div>
                    <div className="item-wrapper">
                        {project.lookingFor.map((skill) => {
                            return <p className='skill' key={skill}>{skill}</p>
                        })}
                    </div>
                    <div>
                        <p>Start: {project.startDate.slice(0, -14)}</p>
                        <p>End: {project.endDate.slice(0, -14)}</p>
                    </div>
                    <div>
                        <p>Where?</p>
                        <p className='location'>{project.isRemote ? "online" : (project.city + ", " + project.country)}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProjectDetail;