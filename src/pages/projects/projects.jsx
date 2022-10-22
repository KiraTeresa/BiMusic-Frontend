import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import apiClient from '../../services/apiClient'
import ProjectCard from '../../components/ProjectCard/ProjectCard'
import Loading from '../../components/Loading/Loading';
import './projects.scss'
import GENRE_ENUM from '../../consts/genreEnum';
import SKILL_ENUM from '../../consts/skillEnum';

function Projects() {
    const [allProjects, setAllProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState({
        title: "",
        genre: "",
        lookingFor: "",
        location: ""
    })
    const [filteredProjects, setFilteredProjects] = useState(undefined)

    // console.log(allProjects);

    useEffect(() => {
        apiClient.get("/projects").then((result) => {
            // console.log("The result: ", result)
            setAllProjects(result.data)
            // setFilteredProjects(result.data)
        }).catch((err) => console.log("Error when trying to get projects from server.")).finally(() => setIsLoading(false))
    }, [])

    function handleFilterChange(e) {
        const { name, value } = e.target
        console.log(`Set filter for ${name} to value ${value}.`)
        const newSearch = { ...search, [name]: value }
        setSearch(newSearch)
        // filterProjects(newSearch);
        let newProjectList = allProjects.slice();

        if (newSearch.genre) {
            newProjectList = newProjectList.filter((proj) => {
                return proj.genre.includes(newSearch.genre)
            })
        }

        if (newSearch.lookingFor) {
            newProjectList = newProjectList.filter((proj) => {
                return proj.lookingFor.includes(newSearch.lookingFor)
            })
        }

        setFilteredProjects(newProjectList)
        console.log("NEW >>> ", newProjectList)
    }

    function resetFilter() {
        setFilteredProjects(undefined)
        // setSearchActive(false)
    }

    console.log("The search: ", search)

    if (isLoading) {
        return <Loading />
    }

    return (
        <div>
            <h2>All available projects</h2>
            <Link to="/projects/create">
                <button>Post your project</button>
            </Link>
            <div>
                <h4>Filter</h4>
                {/* <select>
                    <option value=""> -- filter by title --</option>
                    {allProjects.map(proj => {
                        return <option key={proj._id}>{proj.title}</option>
                    })}
                </select> */}
                <select name="genre" onChange={handleFilterChange}>
                    <option value=""> -- filter by genre --</option>
                    {GENRE_ENUM.map(genre => {
                        return <option key={genre} value={genre}>{genre}</option>
                    })}
                </select>
                <select name="lookingFor" onChange={handleFilterChange}>
                    <option value=""> -- filter by skill --</option>
                    {SKILL_ENUM.map(skill => {
                        return <option key={skill} value={skill}>{skill}</option>
                    })}
                </select>
                <button onClick={resetFilter}>Reset</button>
                <div><strong>{filteredProjects.length}</strong> project{filteredProjects.length > 1 ? "s" : ""} meet{filteredProjects.length === 1 ? "s" : ""} your criteria</div>
            </div>
            {!allProjects && <p>Sorry, there are no projects matching your search. Try another filter</p>}
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