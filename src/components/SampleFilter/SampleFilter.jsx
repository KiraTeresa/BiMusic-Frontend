import { useCallback, useEffect, useState } from "react"

function SampleFilter({ allSamples, sendToParent }) {
  const [genreFilter, setGenreFilter] = useState([])
  const [search, setSearch] = useState({
    genre: "",
  })

  const resetFilter = useCallback(() => {
    updateGenreFilter(allSamples)
    setSearch({
      genre: ""
    })
    sendToParent(allSamples)
  }, [allSamples, sendToParent])

  useEffect(() => {
    resetFilter()
  }, [resetFilter])

  function updateGenreFilter(filteredSamp) {
    const possibleGenres = []
    for (const samp of filteredSamp) {
      for (const genre of samp.genre) {
        if (!possibleGenres.includes(genre)) {
          possibleGenres.push(genre)
        }
      }
    }
    setGenreFilter(possibleGenres.sort())
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
    let newSampleList = allSamples.slice();

    if (newSearch.genre) {
      newSampleList = newSampleList.filter((samp) => {
        return samp.genre.includes(newSearch.genre)
      })
    }
    // changes filter options to show only possible ones
    updateGenreFilter(newSampleList)
    sendToParent(newSampleList)
    // console.log("NEW >>> ", newProjectList)
  }



  return (
    <div className="filter-container">

      {/* Genre */}
      <select value={search.genre} name="genre" onChange={handleFilterChange}>
        <option value=""> -- filter by genre --</option>
        {genreFilter.map(genre => {
          return <option key={genre} value={genre}>{genre}</option>
        })}
      </select>

      {/* Reset */}
      <button className="btn tertiary reset" onClick={resetFilter}>reset filter</button>

      {!allSamples && <p>Sorry, there are no projects matching your search. Try another filter</p>}
    </div>
  )
}

export default SampleFilter;