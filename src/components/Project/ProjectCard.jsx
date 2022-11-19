import './ProjectCard.scss'
import { Link } from 'react-router-dom';
import commentIcon from '../../assets/icons/chat-icon-white.png'
import contributorsIcon from '../../assets/icons/collab-icon-white.png'
import sampleIcon from '../../assets/icons/note-icon-white.png'

function ProjectCard({ project, backgroundColor }) {
    const { _id, title, shortDescription, lookingFor, initiator, collaborators, comments, sample } = project;

    return (
        <div className="project-card" style={{ backgroundColor }}>
            <Link to={`/projects/${_id}`}>

                <div className='card-head'>
                    <div className='main-info'>
                        <div className='about'>
                            <p className='title'>{title}</p>
                            <p className='shortD'> {shortDescription}</p>
                        </div>
                        <div className='icon-wrapper'>
                            <div>
                                <img className="icon" src={commentIcon} alt="comment icon" />{comments ? comments.length : "0"}
                            </div>
                            <div>
                                <img className="icon" src={contributorsIcon} alt="contributors icon" />{collaborators ? collaborators.length : "0"}
                            </div>
                            {sample ?
                                <div className='sample-icon'>
                                    <img className={`icon`} src={sampleIcon} alt="sample icon" />
                                </div>
                                : ""}
                        </div>
                    </div>
                </div>

                <div className="card-bottom">
                    <span className="initiator">{initiator.name}</span><span>is looking for a</span>
                    {lookingFor.map((skill) => {
                        return <span key={skill} className="skill">{skill}</span>
                    })}
                </div>
            </Link>
        </div>
    )
}

export default ProjectCard;