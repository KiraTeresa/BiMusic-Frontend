import { useEffect, useState } from "react"
import GENRE_ENUM from '../../consts/genreEnum';
import SKILL_ENUM from '../../consts/skillEnum';

function ProjectFilter({ allProjects, sendToParent }) {
    const [filteredProjects, setFilteredProjects] = useState(undefined)
    const [allCountries, setAllCountries] = useState([]);
    const [allCities, setAllCities] = useState([])
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
        setAllCountries(countriesArr)
        setAllCities(citiesArr)
    }, [])

    function handleFilterChange(e) {
        const { name, value } = e.target
        const newSearch = { ...search, [name]: value }
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
        }

        if (newSearch.lookingFor) {
            newProjectList = newProjectList.filter((proj) => {
                return proj.lookingFor.includes(newSearch.lookingFor)
            })
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
                setAllCities(citiesArr)
            }
        }

        if (newSearch.city) {
            newProjectList = newProjectList.filter((proj) => {
                return proj.city === newSearch.city
            })
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

            {!allProjects && <p>Sorry, there are no projects matching your search. Try another filter</p>}
        </div>
    )
}

export default ProjectFilter