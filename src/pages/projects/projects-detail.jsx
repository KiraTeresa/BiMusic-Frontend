import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
    const [userStatus, setUserStatus] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const { projectId } = useParams();
    const [isCollab, setIsCollab] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const { alreadyCollab, alreadyPending, isInitiator } = userStatus;
    const navigate = useNavigate();

    // console.log("ID --> ", projectId)

    useEffect(() => {
        apiClient.get(`/projects/${projectId}`).then(async (result) => {
            console.log("Res from server: ", result)

            // const isCollab = await result.data.collaborators.find((e) => e._id === user._id)
            // if (isCollab) {
            //     await setAlreadyCollab(true)
            //     console.log("Is collab ", isCollab)
            // }

            // const isPending = await result.data.pendingCollabs.find((e) => e._id === user._id)
            // if (isPending) {
            //     await setAlreadyPending(true)
            //     console.log("Is pending ", isPending)
            // }

            // if (result.data.initiator._id === user._id) {
            //     await setUserIsInitiator(true)
            // }
            setProject(result.data.project)
            setUserStatus(result.data.aUserStatus)
        }).catch((err) => console.log("No Project details received ", err)).finally(() => setIsLoading(false))
    }, [projectId, isCollab, isPending, refresh])

    async function triggerJoinLeave() {
        await apiClient.post(`/projects/${projectId}/${user._id}`).then((result) => {
            console.log("Backend responded: ", result)
        }).catch((err) => console.log("Error: ", err))

        if (isCollab) {
            setIsCollab(false)
        }

        if (isPending) {
            setIsPending(false)
        }

        if (!isInitiator && !isCollab && !isPending) {
            setIsPending(true)
        }
    }

    async function handleUserRequest(e) {
        console.log("Event ", e.target)
        const { value, name } = e.target;
        await apiClient.post(`/projects/${projectId}/${value}/${name}`).then((result) => {
            console.log("Backend handled the user request: ", result);
            setRefresh(!refresh)
        }).catch((err) => console.log("Error: ", err))
    }

    async function handleProjectDelete(e) {
        await apiClient.post(`/projects/${projectId}/delete`).then((result) => {
            console.log("Info from backend regarding deleting a project: ", result)
            navigate('/projects')
        }).catch((err) => console.log("An error occured while trying to delete a project >> ", err))
    }

    if (isLoading) {
        return <Loading />
    }


    console.log("WHO is WHO *********** ", alreadyCollab, " | ", alreadyPending, " | ", isInitiator)
    const { _id, title, shortDescription, longDescription, genre, lookingFor, startDate, endDate, isRemote, city, country, initiator, collaborators, pendingCollabs, comments, sample } = project;


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
                        {project.collaborators.map((collab) => {
                            return (<div key={collab.name}>
                                <h3>{collab.name}</h3>
                                <img src={collab.avatar ? collab.avatar : "https://upload.wikimedia.org/wikipedia/commons/3/3f/Placeholder_view_vector.svg"} alt="user avatar" />
                            </div>)
                        })}
                        {isInitiator ? <div><h4>Pending:</h4>
                            {pendingCollabs.map((collab) => {
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
                        <h2>{title}</h2>
                        <p>{shortDescription}</p>
                        <p>{longDescription}</p>
                        {alreadyCollab ? "" : alreadyPending ? "" : isInitiator ? "" : <button onClick={triggerJoinLeave}>join</button>}
                    </div>
                    <div className="comment-wrapper">
                        <div className="comments">
                            <img className="icon" src={commentIcon} alt="comment icon" />{comments ? project.comments.length : "0"}
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
                    {isInitiator ? <button onClick={handleProjectDelete}> -- DELETE -- </button> : ""}
                </div>
            </div>
        </div>
    )
}

export default ProjectDetail;