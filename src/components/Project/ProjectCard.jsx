import { Link } from 'react-router-dom';
import commentIcon from '../../assets/icons/100.png'
import contributorsIcon from '../../assets/icons/24.png'
import sampleIcon from '../../assets/icons/71.png'

function ProjectCard({ project, backgroundColor }) {
    const { _id, title, shortDescription, genre, lookingFor, startDate, endDate, isRemote, city, country, initiator, collaborators, comments, sample } = project;

    return (
        <div className="project-card" style={{ backgroundColor }}>
            <Link to={`/projects/${_id}`}>
                <div className='card-head'>
                    <p className='title'>{title}</p>
                    <div className='main-info'>

                        <div className='about'>
                            <p className='shortD'> {shortDescription}</p>
                        </div>
                        <div className='looking-for'>
                            <div>{initiator.name} is looking for </div>
                            <div className="item-wrapper">
                                {lookingFor.map((skill) => {
                                    return <p key={skill} className="skill"> {skill} </p>
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className="date-location">
                    <p className='date'>{startDate.slice(0, -14)} - {endDate.slice(0, -14)}</p>
                    <p className='location'>{isRemote ? "online" : (city + ", " + country)}</p>
                </div> */}
                <div className='card-body'>
                    {/* <div className='looking-for'> */}
                    {/* <img src={initiator.avatar} alt="user avatar" /> */}
                    {/* </div> */}
                    <div className='item-wrapper'>
                        {/* <h4>Genre:</h4> */}
                        {genre.map((g) => {
                            return <p key={g}>{g}</p>
                        })}
                        {/* <h4>{initiator.name} is looking for a </h4>
                        {lookingFor.map((skill) => {
                            return <p key={skill} className="skill"> {skill} </p>
                        })} */}
                    </div>
                </div>
                <div className="card-bottom">
                    <p>Posted by <span className="initiator">{initiator.name}</span></p>
                    <div>
                        <img className="icon" src={commentIcon} alt="comment icon" />{comments ? comments.length : "0"}
                        <img className="icon" src={contributorsIcon} alt="contributors icon" />{collaborators ? collaborators.length : "0"}
                        {sample ?
                            <img className={`icon`} src={sampleIcon} alt="sample icon" /> : ""}
                    </div>
                </div>
                {/* <button className='btn primary'>Read more about this project</button> */}
            </Link>
        </div>
    )
}

export default ProjectCard;