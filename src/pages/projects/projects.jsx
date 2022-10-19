import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import apiClient from '../../services/apiClient'
import commentIcon from '../../assets/icons/100.png'
import contributorsIcon from '../../assets/icons/24.png'
import sampleIcon from '../../assets/icons/71.png'

function Projects() {
    const [allProjects, setAllProjects] = useState([])

    useEffect(() => {
        apiClient.get("/projects").then((result) => {
            console.log("The result: ", result)
            setAllProjects(result.data)
        }).catch((err) => console.log("Error when trying to get projects from server."))
    }, [])

    return (
        <div>
            <h2>All available projects</h2>
            <Link to="/projects/create">
                <button>Post your project</button>
            </Link>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", maxWidth: "80vw", margin: "auto" }}>
                {allProjects.map(project => {
                    const { _id, title, shortDescription, genre, lookingFor, startDate, endDate, isRemote, city, country, collaborators, comments, sample } = project;
                    console.log("C:", comments)
                    return (
                        <div key={_id} style={{ border: "1px solid black", minWidth: "350px" }}>
                            <h3>{title}</h3>
                            <p>{shortDescription}</p>
                            <div style={{ display: "flex", gap: "4px" }}>
                                {genre.map((g) => {
                                    return <p key={g} style={{ border: "grey 1px dashed" }}>{g}</p>
                                })}
                            </div>
                            <div style={{ display: "flex", gap: "4px" }}>
                                {lookingFor.map((skill) => {
                                    return <p key={skill} style={{ border: "blue 1px dashed" }}>{skill}</p>
                                })}
                            </div>
                            <div>
                                <p>{startDate.slice(0, -14)} - {endDate.slice(0, -14)}</p>
                                <p>{isRemote ? "online" : (city + ", " + country)}</p>
                            </div>
                            <img src={commentIcon} alt="comment icon" style={{ height: "30px" }} />{comments ? comments.length : "0"}
                            <img src={contributorsIcon} alt="contributors icon" style={{ height: "30px" }} />{collaborators ? collaborators.length : "0"}
                            {sample ? <img src={sampleIcon} alt="sample icon" style={{ height: "30px" }} /> : ""}
                        </div>)
                })}
            </div>
        </div>
    )
}

export default Projects