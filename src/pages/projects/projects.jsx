import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import apiClient from '../../services/apiClient'
import ProjectCard from '../../components/Project/ProjectCard'
import ProjectFilter from '../../components/Project/ProjectFilter';
import Loading from '../../components/Loading/Loading';
import './projects.scss'
import filterIcon from '../../assets/icons/filter-icon-white.png'

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
    }, [navigate])

    function toggleFilter() {
        setShowFilter(!showFilter)
    }

    if (isLoading) {
        return <Loading />
    }

    return (
        <div className='projects-container'>
            <div className='head'>
                <h2>All available projects</h2>
                <Link to="/projects/create"><button className='btn primary'>Post your project</button></Link>
            </div>

            <div className='filter-wrapper'>
                <div className='filter-icon' onClick={toggleFilter}>
                    <img src={filterIcon} alt="filter icon"></img>

                    {/* <button className='btn secondary filter-btn' onClick={toggleFilter}>{showFilter ? "hide filter" : "show filter"}</button> */}


                    <div className='filter-result'>{filteredProjects ? <div><strong>{filteredProjects.length}</strong> project{filteredProjects.length > 1 ? "s" : ""} meet{filteredProjects.length === 1 ? "s" : ""} your criteria</div> : ""}</div>
                </div>

                {showFilter ? <ProjectFilter allProjects={allProjects} sendToParent={setFilteredProjects} /> : ""}
            </div>

            <div className="project-card-wrapper">
                {filteredProjects && filteredProjects.map(proj => {
                    return <ProjectCard key={proj._id} project={proj} />
                })}
                {!filteredProjects && allProjects.map(proj => {
                    return <ProjectCard key={proj._id} project={proj} />
                })}
            </div>
        </div>
    )
}

export default Projects