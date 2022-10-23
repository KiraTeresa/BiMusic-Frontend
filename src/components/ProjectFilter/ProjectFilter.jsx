import { useEffect, useState } from "react"
import GENRE_ENUM from '../../consts/genreEnum';
import SKILL_ENUM from '../../consts/skillEnum';

function ProjectFilter({ allProjects, sendToParent }) {
    const [filteredProjects, setFilteredProjects] = useState(undefined)
    const [genreFilter, setGenreFilter] = useState(GENRE_ENUM)
    const [skillFilter, setSkillFilter] = useState(SKILL_ENUM)
    const [countryFilter, setCountryFilter] = useState([])
    const [cityFilter, setCityFilter] = useState([])
    const [search, setSearch] = useState({
        text: "",
        genre: "",
        lookingFor: "",
        country: "",
        city: "",
    })
    console.log("The search: ", search)

    useEffect(() => {
        const countriesArr = []
        const citiesArr = []
        for (const proj of allProjects) {
            if (!countriesArr.includes(proj.country) && !proj.isRemote) {
                countriesArr.push(proj.country)
            }
            if (!citiesArr.includes(proj.city) && !proj.isRemote) {
                citiesArr.push(proj.city)
            }
        }
        setCountryFilter(countriesArr)
        setCityFilter(citiesArr)
    }, [])

    function updateGenreFilter(filteredProj) {
        const possibleGenres = []
        for (const proj of filteredProj) {
            if (!possibleGenres.includes(proj.genre)) {
                possibleGenres.push(proj.genre)
            }
        }
        setGenreFilter(possibleGenres)
    }

    function updateSkillFilter(filteredProj) {
        const possibleSkills = []
        for (const proj of filteredProj) {
            if (!possibleSkills.includes(proj.lookingFor)) {
                possibleSkills.push(proj.lookingFor)
            }
        }
        setSkillFilter(possibleSkills)
    }

    function handleFilterChange(e) {
        const { name, value } = e.target
        let newSearch;

        if (name === "country" && value === "isRemote") {
            newSearch = { ...search, [name]: value, city: "" }
        } else {
            newSearch = { ...search, [name]: value }
        }
        setSearch(newSearch)
        let newProjectList = allProjects.slice();

        if (newSearch.text) {
            // checks title, shortDescription and longDescription for the serached word
            newProjectList = newProjectList.filter((proj) => {
                return proj.title.toLowerCase().includes(newSearch.text.toLowerCase()) || proj.shortDescription.toLowerCase().includes(newSearch.text.toLowerCase()) || proj.longDescription.toLowerCase().includes(newSearch.text.toLowerCase())
            })
        }

        if (newSearch.genre) {
            newProjectList = newProjectList.filter((proj) => {
                return proj.genre.includes(newSearch.genre)
            })
            // TO DO: other filters should only show possible options
            // updateSkillFilter(newProjectList)
        }

        if (newSearch.lookingFor) {
            newProjectList = newProjectList.filter((proj) => {
                return proj.lookingFor.includes(newSearch.lookingFor)
            })
            // TO DO: other filters should only show possible options
            // updateGenreFilter(newProjectList)
        }

        if (newSearch.country) {
            if (newSearch.country === "isRemote") {
                newProjectList = newProjectList.filter((proj) => {
                    return proj.isRemote
                })
            } else {
                newProjectList = newProjectList.filter((proj) => {
                    return proj.country === newSearch.country
                })
                const citiesArr = []
                for (const proj of newProjectList) {
                    if (!citiesArr.includes(proj.city)) {
                        citiesArr.push(proj.city)
                    }
                }
                setCityFilter(citiesArr)
            }
            // TO DO: other filters should only show possible options

        }

        if (newSearch.city) {
            newProjectList = newProjectList.filter((proj) => {
                return proj.city === newSearch.city
            })
            // TO DO: other filters shouls only show possible options

        }

        setFilteredProjects(newProjectList)
        sendToParent(newProjectList)
        console.log("NEW >>> ", newProjectList)
    }

    function resetFilter() {
        setFilteredProjects(allProjects)
        setSearch({
            text: "",
            genre: "",
            lookingFor: "",
            location: ""
        })
        sendToParent(allProjects)
    }

    return (
        <div>
            <h4>Filter</h4>
            <label>Text search:
                <input type="text" name="text" value={search.text} onChange={handleFilterChange}></input>
            </label>
            <select name="genre" onChange={handleFilterChange}>
                <option value=""> -- filter by genre --</option>
                {genreFilter.map(genre => {
                    return <option key={genre} value={genre}>{genre}</option>
                })}
            </select>
            <select name="lookingFor" onChange={handleFilterChange}>
                <option value=""> -- filter by skill --</option>
                {skillFilter.map(skill => {
                    return <option key={skill} value={skill}>{skill}</option>
                })}
            </select>
            <select name="country" onChange={handleFilterChange}>
                <option value=""> -- filter by country --</option>
                <option value="isRemote">{'>>'} online</option>
                {countryFilter.map(country => {
                    return <option key={country} value={country}>{country}</option>
                })}
            </select>
            <select name="city" onChange={handleFilterChange} disabled={search.country === "isRemote"}>
                <option value=""> -- filter by city --</option>
                {cityFilter.map(city => {
                    return <option key={city} value={city}>{city}</option>
                })}
            </select>
            <button onClick={resetFilter}>Reset</button>


            {!allProjects && <p>Sorry, there are no projects matching your search. Try another filter</p>}
        </div>
    )
}

export default ProjectFilter