import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import apiClient from "../../services/apiClient";
import Loading from '../../components/Loading/Loading';
import { useAuth } from "../../context/auth.context";
import commentIcon from '../../assets/icons/100.png'
import sampleIcon from '../../assets/icons/71.png'
import CommentForm from "../../components/CommentFeedback/CommentFeedbackForm";
import CommentCard from "../../components/CommentFeedback/CommentFeedbackCard";
import SampleCard from "../../components/SampleCard/SampleCard";

function ProjectDetail() {
    const { user } = useAuth() // <-- returns logged-in user (_id, email, name) << useEffect??
    const [project, setProject] = useState({});
    const [userStatus, setUserStatus] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const { id: projectId } = useParams();
    const [refresh, setRefresh] = useState(false);
    const { alreadyCollab, alreadyPending, isInitiator } = userStatus;
    const [errorMessage, setErrorMessage] = useState("")
    const navigate = useNavigate();

    const refreshPage = useCallback(() => {
        setRefresh(!refresh)
    }, [refresh])

    useEffect(() => {
        apiClient.get(`/projects/${projectId}`).then(async (result) => {
            // console.log("Res from server: ", result)
            setProject(result.data.project)
            setUserStatus(result.data.aUserStatus)
        }).catch((err) => {
            if (err.response.status === 500) {
                navigate('/internal-server-error')
            } else { console.log(err) }
        }).finally(() => setIsLoading(false))
    }, [projectId, alreadyCollab, alreadyPending, refresh])

    async function triggerJoinLeave() {
        await apiClient.post(`/projects/${projectId}/${user._id}`).then((result) => {
            // console.log("Backend responded: ", result)
        }).catch((err) => {
            if (err.response.status === 500) {
                navigate('/internal-server-error')
            } else { console.log(err) }
        })

        if (alreadyCollab) {
            setUserStatus({ ...userStatus, alreadyCollab: false })
        }

        if (alreadyPending) {
            setUserStatus({ ...userStatus, alreadyPending: false })
        }

        if (!isInitiator && !alreadyCollab && !alreadyPending) {
            setUserStatus({ ...userStatus, alreadyPending: true })
        }
    }

    async function handleUserRequest(e) {
        // console.log("Event ", e.target)
        const { value, name } = e.target;
        await apiClient.post(`/projects/${projectId}/${value}/${name}`).then((result) => {
            // console.log("Backend handled the user request: ", result);
            refreshPage()
        }).catch((err) => {
            if (err.response.status === 500) {
                navigate('/internal-server-error')
            } else {
                console.log("Error: ", err)
                setErrorMessage(err.response.data.message)
            }
        })
    }

    async function handleProjectDelete(e) {
        await apiClient.post(`/projects/${projectId}/delete`).then((result) => {
            // console.log("Info from backend regarding deleting a project: ", result)
            navigate('/projects')
        }).catch((err) => {
            if (err.response.status === 500) {
                navigate('/internal-server-error')
            } else {
                const errorDescription = err.response.data.message;
                setErrorMessage(errorDescription)
            }
        })
    }

    if (isLoading) {
        return <Loading />
    }


    // console.log("WHO is WHO *********** ", alreadyCollab, " | ", alreadyPending, " | ", isInitiator)
    const { title, shortDescription, longDescription, genre, lookingFor, startDate, endDate, isRemote, city, country, initiator, pendingCollabs, comments, sample } = project;


    return (
        <div className="project-detail-wrapper">
            <div className="project-detail">
                <div className="participants">
                    <div>
                        <Link to={`/profile/${initiator.name}`}>
                            <div className={`user-status ${initiator.status}`}></div>
                            <h3>{initiator.name}</h3>
                            <img src={initiator.avatar} alt="user avatar" /></Link>
                    </div>

                    <div className="collaborators">
                        <h4>Collaborators:</h4>
                        {project.collaborators.map((collab) => {
                            return (<div key={collab.name}>
                                <Link to={`/profile/${collab.name}`}>
                                    <div className={`user-status ${collab.status}`}></div>
                                    <h3>{collab.name}</h3>
                                    <img src={collab.avatar} alt="user avatar" />
                                </Link>
                            </div>)
                        })}
                        {isInitiator ? <div><h4>Pending:</h4>
                            {pendingCollabs.map((collab) => {
                                return (<div key={collab._id}>
                                    <Link to={`/profile/${collab.name}`}>
                                        <div className={`user-status ${collab.status}`}></div>
                                        <h3>{collab.name}</h3>
                                        <img src={collab.avatar} alt="user avatar" />
                                    </Link>
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
                    {errorMessage ? <div className="error-message">{errorMessage}</div> : ""}
                    <div className="description">
                        <h2>{title}</h2>
                        <p>{shortDescription}</p>
                        <p>{longDescription}</p>
                        {alreadyCollab ? "" : alreadyPending ? "" : isInitiator ? "" : <button onClick={triggerJoinLeave}>join</button>}
                    </div>
                    <div className="comment-wrapper">
                        <div className="comments">
                            <img className="icon" src={commentIcon} alt="comment icon" />{comments ? project.comments.length : "0"}
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <CommentForm props={{ refreshPage, type: "comment" }} />
                                {project.comments.reverse().map((comment) => {
                                    return (
                                        <CommentCard key={comment._id} commentInfo={comment} />
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="sample">
                        <img className={`icon ${!sample ? "grayout" : ""}`} src={sampleIcon} alt="sample icon" />
                        {sample ? <SampleCard sampleInfo={sample} /> : "-- no sample --"}
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