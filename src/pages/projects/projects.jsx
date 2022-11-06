import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import apiClient from '../../services/apiClient'
import ProjectCard from '../../components/Project/ProjectCard'
import ProjectFilter from '../../components/Project/ProjectFilter';
import Loading from '../../components/Loading/Loading';
import './projects.scss'

function Projects() {
    const [allProjects, setAllProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filteredProjects, setFilteredProjects] = useState(undefined)
    const [showFilter, setShowFilter] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        apiClient.get("/projects").then((result) => {
            setAllProjects(result.data)
        }).catch((err) => {
            if (err.response.status === 500) {
                navigate('/internal-server-error')
            } else { console.log(err) }
        }).finally(() => setIsLoading(false))
    }, [])

    function toggleFilter() {
        setShowFilter(!showFilter)
    }

    if (isLoading) {
        return <Loading />
    }

    return (
        <div>
            <h2>All available projects</h2>
            <Link to="/projects/create">
                <button>Post your project</button>
            </Link>

            <button onClick={toggleFilter} style={{ backgroundColor: "#63A18F" }}>{showFilter ? "hide filter" : "show filter"}</button>

            {showFilter ? <ProjectFilter allProjects={allProjects} sendToParent={setFilteredProjects} /> : ""}

            <div>{filteredProjects ? <div><strong>{filteredProjects.length}</strong> project{filteredProjects.length > 1 ? "s" : ""} meet{filteredProjects.length === 1 ? "s" : ""} your criteria</div> : ""}</div>

            <div className="projects-container">
                {filteredProjects && filteredProjects.map(proj => {
                    return <ProjectCard key={proj._id} project={proj} backgroundColor="lightBlue" />
                })}
                {!filteredProjects && allProjects.map(proj => {
                    return <ProjectCard key={proj._id} project={proj} backgroundColor="yellow" />
                })}
            </div>
        </div>
    )
}

export default Projects