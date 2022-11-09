import './samplesDetail.scss'
import { useCallback, useEffect, useState, useContext } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import apiClient from "../../services/apiClient";
import Loading from '../../components/Loading/Loading';
import { AuthContext } from "../../context/auth.context";
import commentIcon from '../../assets/icons/100.png'
import sampleIcon from '../../assets/icons/71.png'
import FeedbackForm from "../../components/CommentFeedback/CommentFeedbackForm";
import FeedbackCard from "../../components/CommentFeedback/CommentFeedbackCard";
import SampleCard from "../../components/SampleCard/SampleCard";

function SamplesDetail() {
    const { user } = useContext(AuthContext)//this function will give us the user info
    const { id } = useParams();
    const [sample, setSample] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [refresh, setRefresh] = useState(false);
    const navigate = useNavigate()

    const refreshPage = useCallback(() => {
        setRefresh(!refresh)
    }, [refresh])

    useEffect(() => {
        apiClient.get(`/samples/sample/${id}`).then(async (result) => {
            console.log("Res from server: ", result)
            setSample(result.data)
        }).catch((err) => {
            if (err.response.status === 500) {
                navigate('/internal-server-error')
            } else {
                console.log("No Project details received ", err)
                const errorDescription = err.response.data.message;
                navigate('/', { state: { errorMessage: errorDescription } })
            }
        }).finally(() => setIsLoading(false))
    }, [id, refresh])

    // async function handleProjectDelete(e) {
    //     await apiClient.post(`/projects/${projectId}/delete`).then((result) => {
    //         console.log("Info from backend regarding deleting a project: ", result)
    //         navigate('/projects')
    //     }).catch((err) => console.log("An error occured while trying to delete a project >> ", err))
    // }

    if (isLoading) {
        return <Loading />
    }
    const { title, genre, artist, description } = sample;

    return (
        <div className="sample-detail-container">
            <div className="project-info-wrapper">

                {/* artist */}
                <div className="initiator border-top">
                    <h4>artist</h4>
                    <Link to={`/profile/${artist.name}`}>
                        <img src={artist.avatar} alt="user avatar" />
                        <div className="user-info">
                            <p>{artist.name}</p>
                            <p>
                                <span className={`user-status ${artist.status}`}></span>
                            </p>
                        </div>
                    </Link>
                </div>

                {/* sample */}
                <div className="description">
                    <h2>{title}</h2>
                    <p className="longD">{description}</p>
                    {sample ? <SampleCard sampleInfo={sample} /> : "-- no sample --"}
                </div>
            </div>

            {/* feedback */}
            <div className='border-top'>
                <h4 className='full'>feedback</h4>
                <div className="comments">

                    <FeedbackForm props={{ refreshPage, type: "feedback" }} />

                    {/* no feedback */}
                    {sample.feedback.length === 0 ? <div>-- be the first to give feedback --</div> : ""}

                    {/* feedback */}
                    {sample?.feedback.reverse().map((element) => {
                        return (
                            <FeedbackCard key={element._id} commentInfo={element} />
                        )
                    })}
                </div>
            </div>
        </div >
    )
    // return (
    //     <div className="project-detail-wrapper">
    //         <div className="project-detail">
    //             <div className="participants">
    //                 <div>
    //                     <Link to={`/profile/${artist.name}`}><h3>{artist.name}</h3>
    //                     </Link>
    //                 </div>
    //             </div>
    //             <div className="main">
    //                 <div className="description">
    //                     <h2>{title}</h2>
    //                 </div>
    //                 <div>
    //                     <div className="comments">
    //                         <img className="icon" src={commentIcon} alt="comment icon" />{sample?.feedback ? sample.feedback.length : "0"}
    //                         <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
    //                             <FeedbackForm props={{ refreshPage, type: "feedback" }} />
    //                             {sample?.feedback.reverse().map((element) => {
    //                                 return (
    //                                     <FeedbackCard key={element._id} commentInfo={element} />
    //                                 )
    //                             })}
    //                         </div>
    //                     </div>
    //                 </div>
    //                 <div className="sample">
    //                     {sample ? <SampleCard sampleInfo={sample} /> : "-- no sample --"}
    //                 </div>
    //             </div>
    //             <div className="aside">
    //                 <div className="item-wrapper">
    //                     {genre.map((g) => {
    //                         return <p className='genre' key={g}>{g}</p>
    //                     })}
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // )
}

export default SamplesDetail;