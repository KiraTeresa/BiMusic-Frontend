import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import apiClient from '../../services/apiClient'
import ProjectCard from '../../components/ProjectCard/ProjectCard'
import Loading from '../../components/Loading/Loading';
import './projects.scss'
// import GENRE_ENUM from '../../consts/genreEnum';
// import SKILL_ENUM from '../../consts/skillEnum';
import ProjectFilter from '../../components/ProjectFilter/ProjectFilter';

function Projects() {
    const [allProjects, setAllProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filteredProjects, setFilteredProjects] = useState(undefined)
    // const [allCountries, setAllCountries] = useState([]);
    // const [allCities, setAllCities] = useState([])
    // const [search, setSearch] = useState({
    //     text: "",
    //     genre: "",
    //     lookingFor: "",
    //     country: "",
    //     city: "",
    // })
    // console.log(allProjects);

    useEffect(() => {
        apiClient.get("/projects").then((result) => {
            // console.log("The result: ", result)
            setAllProjects(result.data)
            // setFilteredProjects(result.data)

            // const countriesArr = []
            // const citiesArr = []
            // for (const proj of result.data) {
            //     if (!countriesArr.includes(proj.country) && !proj.isRemote) {
            //         countriesArr.push(proj.country)
            //     }
            //     if (!citiesArr.includes(proj.city) && !proj.isRemote) {
            //         citiesArr.push(proj.city)
            //     }
            // }
            // setAllCountries(countriesArr)
            // setAllCities(citiesArr)
        }).catch((err) => console.log("Error when trying to get projects from server.", err)).finally(() => setIsLoading(false))
    }, [])

    // function handleFilterChange(e) {
    //     const { name, value } = e.target
    //     console.log(`Set filter for ${name} to value ${value}.`)
    //     const newSearch = { ...search, [name]: value }
    //     setSearch(newSearch)
    //     // filterProjects(newSearch);
    //     let newProjectList = allProjects.slice();

    //     if (newSearch.text) {
    //         // checks title, shortDescription and longDescription for the serached word
    //         newProjectList = newProjectList.filter((proj) => {
    //             return proj.title.toLowerCase().includes(newSearch.text.toLowerCase()) || proj.shortDescription.toLowerCase().includes(newSearch.text.toLowerCase()) || proj.longDescription.toLowerCase().includes(newSearch.text.toLowerCase())
    //         })
    //     }

    //     if (newSearch.genre) {
    //         newProjectList = newProjectList.filter((proj) => {
    //             return proj.genre.includes(newSearch.genre)
    //         })
    //     }

    //     if (newSearch.lookingFor) {
    //         newProjectList = newProjectList.filter((proj) => {
    //             return proj.lookingFor.includes(newSearch.lookingFor)
    //         })
    //     }

    //     if (newSearch.country) {
    //         if (newSearch.country === "isRemote") {
    //             newProjectList = newProjectList.filter((proj) => {
    //                 return proj.isRemote
    //             })
    //         } else {
    //             newProjectList = newProjectList.filter((proj) => {
    //                 return proj.country === newSearch.country
    //             })
    //             const citiesArr = []
    //             for (const proj of newProjectList) {
    //                 if (!citiesArr.includes(proj.city)) {
    //                     citiesArr.push(proj.city)
    //                 }
    //             }
    //             setAllCities(citiesArr)
    //         }
    //     }

    //     if (newSearch.city) {
    //         newProjectList = newProjectList.filter((proj) => {
    //             return proj.city === newSearch.city
    //         })
    //     }

    //     setFilteredProjects(newProjectList)
    //     console.log("NEW >>> ", newProjectList)
    // }

    // function resetFilter() {
    //     setFilteredProjects(allProjects)
    //     setSearch({
    //         text: "",
    //         genre: "",
    //         lookingFor: "",
    //         location: ""
    //     })
    // }

    // console.log("The search: ", search)

    if (isLoading) {
        return <Loading />
    }

    return (
        <div>
            <h2>All available projects</h2>
            <Link to="/projects/create">
                <button>Post your project</button>
            </Link>
            {/* <div>
                <h4>Filter</h4>
                <label>Text search:
                    <input type="text" name="text" value={search.text} onChange={handleFilterChange}></input>
                </label>
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
                <select name="country" onChange={handleFilterChange}>
                    <option value=""> -- filter by country --</option>
                    <option value="isRemote">{'>>'} online</option>
                    {allCountries.map(country => {
                        return <option key={country} value={country}>{country}</option>
                    })}
                </select>
                <select name="city" onChange={handleFilterChange} disabled={search.country === "isRemote"}>
                    <option value=""> -- filter by city --</option>
                    {allCities.map(city => {
                        return <option key={city} value={city}>{city}</option>
                    })}
                </select>
                <button onClick={resetFilter}>Reset</button>
                {filteredProjects ? <div><strong>{filteredProjects.length}</strong> project{filteredProjects.length > 1 ? "s" : ""} meet{filteredProjects.length === 1 ? "s" : ""} your criteria</div> : ""}
            </div>
            {!allProjects && <p>Sorry, there are no projects matching your search. Try another filter</p>} */}
            <ProjectFilter allProjects={allProjects} sendToParent={setFilteredProjects} />
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