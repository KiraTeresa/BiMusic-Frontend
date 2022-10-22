import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import apiClient from '../../services/apiClient'
import ProjectCard from '../../components/ProjectCard/ProjectCard'
import Loading from '../../components/Loading/Loading';
import './projects.scss'

function Projects() {
    const [allProjects, setAllProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    console.log(allProjects);

    useEffect(() => {
        apiClient.get("/projects").then((result) => {
            // console.log("The result: ", result)
            setAllProjects(result.data)
        }).catch((err) => console.log("Error when trying to get projects from server.")).finally(() => setIsLoading(false))
    }, [])

    if (isLoading) {
        return <Loading />
    }

    return (
        <div>
            <h2>All available projects</h2>
            <Link to="/projects/create">
                <button>Post your project</button>
            </Link>
            <div className="projects-container">
                {allProjects && allProjects.map(proj => {
                    return <ProjectCard key={proj._id} project={proj} />
                })}
            </div>
        </div>
    )
}

export default Projects