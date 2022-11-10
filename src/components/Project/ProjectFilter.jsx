import './ProjectFilter.scss'
import { useCallback, useEffect, useState } from "react"

function ProjectFilter({ allProjects, sendToParent }) {
    const [genreFilter, setGenreFilter] = useState([])
    const [skillFilter, setSkillFilter] = useState([])
    const [countryFilter, setCountryFilter] = useState([])
    const [hasRemoteOption, setHasRemoteOption] = useState(false)
    const [cityFilter, setCityFilter] = useState([])
    const [search, setSearch] = useState({
        text: "",
        genre: "",
        lookingFor: "",
        country: "",
        city: "",
    })
    // console.log("The search: ", search)

    const resetFilter = useCallback(() => {
        updateSkillFilter(allProjects)
        updateGenreFilter(allProjects)
        updateCountryFilter(allProjects)
        updateCityFilter(allProjects)

        setSearch({
            text: "",
            genre: "",
            lookingFor: "",
            country: "",
            city: ""
        })

        sendToParent(allProjects)
    }, [allProjects, sendToParent])

    useEffect(() => {
        resetFilter()
    }, [resetFilter])

    function updateGenreFilter(filteredProj) {
        const possibleGenres = []
        for (const proj of filteredProj) {
            for (const genre of proj.genre) {
                if (!possibleGenres.includes(genre)) {
                    possibleGenres.push(genre)
                }
            }
        }
        setGenreFilter(possibleGenres.sort())
    }

    function updateSkillFilter(filteredProj) {
        const possibleSkills = []
        for (const proj of filteredProj) {
            for (const skill of proj.lookingFor) {
                if (!possibleSkills.includes(skill)) {
                    possibleSkills.push(skill)
                }
            }
        }
        setSkillFilter(possibleSkills.sort())
    }

    function updateCountryFilter(filteredProj) {
        const possibleCountries = []
        for (const proj of filteredProj) {
            if (!possibleCountries.includes(proj.country) && proj.country) {
                possibleCountries.push(proj.country)
            }
        }

        const remoteOption = filteredProj.find((proj) => proj.isRemote)
        if (remoteOption) {
            setHasRemoteOption(true)
        } else {
            setHasRemoteOption(false)
        }

        setCountryFilter(possibleCountries.sort())
    }

    function updateCityFilter(filteredProj) {
        const possibleCities = []
        for (const proj of filteredProj) {
            if (!possibleCities.includes(proj.city) && proj.city) {
                possibleCities.push(proj.city)
            }
        }
        setCityFilter(possibleCities.sort())
    }

    function handleFilterChange(e) {
        const { name, value } = e.target
        let newSearch;

        if (name === "country") {
            newSearch = { ...search, [name]: value, city: "" }
        } else {
            newSearch = { ...search, [name]: value }
        }
        setSearch(newSearch)
        let newProjectList = allProjects.slice();

        if (newSearch.text) {
            // checks title, shortDescription and longDescription for the searched word
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
            }
        }

        if (newSearch.city) {
            newProjectList = newProjectList.filter((proj) => {
                return proj.city === newSearch.city
            })
        }

        // changes filter options to show only possible ones
        updateSkillFilter(newProjectList)
        updateGenreFilter(newProjectList)
        updateCountryFilter(newProjectList)
        updateCityFilter(newProjectList)


        sendToParent(newProjectList)
        // console.log("NEW >>> ", newProjectList)
    }


    return (
        <div className="filter-container">

            {/* Text */}
            <label>
                <input type="text" name="text" value={search.text} onChange={handleFilterChange} placeholder=" -- type here to filter by text --"></input>
            </label>

            <div className='wrap-4'>
                <div className="wrap-2">
                    {/* Genre */}
                    <select value={search.genre} name="genre" onChange={handleFilterChange}>
                        <option value=""> -- filter by genre --</option>
                        {genreFilter.map(genre => {
                            return <option key={genre} value={genre}>{genre}</option>
                        })}
                    </select>

                    {/* Skill */}
                    <select value={search.lookingFor} name="lookingFor" onChange={handleFilterChange}>
                        <option value=""> -- filter by skill --</option>
                        {skillFilter.map(skill => {
                            return <option key={skill} value={skill}>{skill}</option>
                        })}
                    </select>
                </div>

                <div className="wrap-2">
                    {/* Country */}
                    <select value={search.country} name="country" onChange={handleFilterChange}>
                        <option value=""> -- filter by country --</option>
                        {hasRemoteOption ? <option value="isRemote">{'>>'} online</option> : ""}
                        {countryFilter.map(country => {
                            return <option key={country} value={country}>{country}</option>
                        })}
                    </select>

                    {/* City */}
                    <select value={search.city} name="city" onChange={handleFilterChange} disabled={search.country === "isRemote"}>
                        <option value=""> -- filter by city --</option>
                        {cityFilter.map(city => {
                            return <option key={city} value={city}>{city}</option>
                        })}
                    </select>
                </div>
            </div>


            {/* Reset */}
            <button className="btn tertiary reset" onClick={resetFilter}>reset filter</button>


            {!allProjects && <p>Sorry, there are no projects matching your search. Try another filter</p>}
        </div>
    )
}

export default ProjectFilter