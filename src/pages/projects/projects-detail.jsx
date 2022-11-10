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
            if (err.response?.status === 500) {
                navigate('/internal-server-error')
            } else { console.log(err) }
        }).finally(() => setIsLoading(false))
    }, [projectId, alreadyCollab, alreadyPending, refresh, navigate])

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
        <div className="project-detail-container">
            {/* info */}
            <div className="project-info-wrapper">
                <div className="description">
                    <h2>{title}</h2>
                    <p className="longD">{longDescription}</p>
                    {/* {alreadyCollab ? "" : alreadyPending ? "" : isInitiator ? "" : <button onClick={triggerJoinLeave}>join</button>} */}

                    <div className="info">
                        <div className="date-location">
                            <p className='location'>Where? <span>{isRemote ? "online" : (city + ", " + country)}</span></p>
                            <p>When? <span>{startDate.slice(0, -14)}</span> {'–'} <span>{endDate.slice(0, -14)}</span></p>
                        </div>

                        <div className="genre-wrapper">
                            <p>Intended genre</p>
                            <div>
                                {genre.map((g) => {
                                    return <span className='genre' key={g}>{g}</span>
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="initiator border-top">
                    <h4>initiator</h4>
                    <Link to={`/profile/${initiator.name}`}>
                        <img src={initiator.avatar} alt="user avatar" />
                        <div className="user-info">
                            <p>{initiator.name}</p>
                            <p>
                                <span className={`user-status ${initiator.status}`}></span>
                            </p>
                        </div>
                    </Link>
                    {isInitiator ? <button className="btn delete" onClick={handleProjectDelete}> DELETE project </button> : ""}
                    {errorMessage ? <div className="error-message">{errorMessage}</div> : ""}
                </div>
            </div>

            <div className="participants">
                <div className="collaborators border-top">
                    <h4 className="full">collaborators</h4>
                    {project.collaborators?.length === 0 ?
                        <div className="no-collab">-- be the first to join --</div>
                        : ""
                    }

                    {/* collaborators */}
                    <div className="collab-list">
                        {project.collaborators.map((collab) => {
                            return (
                                <div className="collab" key={collab.name}>
                                    <Link to={`/profile/${collab.name}`}>
                                        {/* <div className={`user-status ${collab.status}`}></div>
                                <h4>{collab.name}</h4> */}
                                        <img src={collab.avatar} alt="user avatar" />
                                        <div className="user-info">
                                            <p>{collab.name}</p>
                                            <p>
                                                <span className={`user-status ${collab.status}`}></span>
                                            </p>
                                        </div>
                                    </Link>
                                    {collab.name === user.name ?
                                        <button className="btn tertiary" onClick={triggerJoinLeave}>leave collab</button>
                                        : ""}
                                </div>)
                        })}
                    </div>

                    {/* skills */}
                    <div className="skill-list">
                        <p>Are you a</p>
                        <div>
                            {lookingFor.map((skill) => {
                                return <span className='skill' key={skill}>{skill}</span>
                            })}
                        </div>
                        <p>
                            Do you like the project idea?
                        </p>

                        {alreadyCollab ? "" : alreadyPending ? "" : isInitiator ? "" : <button className="btn primary" onClick={triggerJoinLeave}>join</button>}

                        {alreadyPending ? <div className="pend-info">
                            <p>Great, you are already on the pending list. Wait for {initiator.name} to handle your request.</p>
                            <button className="btn tertiary" onClick={triggerJoinLeave}>hop off the pending list</button>
                        </div> : ""}
                    </div>
                </div>

                {/* pending list */}
                {isInitiator ?
                    <div className={`pending-list border-top ${alreadyCollab ? "hide" : ""}`}>
                        <h4 className="full">pending</h4>
                        <div>
                            {pendingCollabs.map((collab) => {
                                return (
                                    <div className="pending" key={collab._id}>
                                        <Link to={`/profile/${collab.name}`}>
                                            <img src={collab.avatar} alt="user avatar" />
                                            <div className="user-info">
                                                <p>{collab.name}</p>
                                                <p>
                                                    <span className={`user-status ${collab.status}`}></span>
                                                </p>
                                            </div>
                                        </Link>
                                        <div className="btn-wrapper">
                                            <button className="btn primary" onClick={handleUserRequest} name="accept" value={collab._id}>Accept</button>
                                            <button className="btn delete" onClick={handleUserRequest} name="reject" value={collab._id}>Reject</button>
                                        </div>
                                    </div>)
                            })}
                        </div>
                    </div>
                    : ""
                }
            </div>

            {/* Sample */}
            {sample ?
                <div className="sample border-top">
                    <h4 className="full">sample: {sample.title}</h4>
                    {/* <p>---- sample sample ----</p> */}
                    {/* {sample?.linkType === "url" ?
                    <p>{initiator.name} added a video of <span className="title">{sample.title}</span>, check it out</p>
                    : sample?.linkType === "upload" ?
                    <p>{initiator.name} uploaded a sample with the title <span className="title">{sample.title}</span>, listen i:</p>
                : ""} */}
                    {/* <img className={`icon ${!sample ? "grayout" : ""}`} src={sampleIcon} alt="sample icon" /> */}
                    <SampleCard sampleInfo={sample} />
                </div>
                : ""
            }

            {/* comments */}
            <div className="comment-wrapper border-top">
                <h4 className="full">comments</h4>
                <div className="comments">
                    {/* <img className="icon" src={commentIcon} alt="comment icon" />{comments ? project.comments.length : "0"} */}
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
        </div>
    )
}

export default ProjectDetail;