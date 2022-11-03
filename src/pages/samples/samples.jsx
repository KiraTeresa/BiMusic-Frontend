import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import apiClient from '../../services/apiClient'
import Loading from '../../components/Loading/Loading';
import SampleCard from '../../components/SampleCard/SampleCard';
import SampleFilter from '../../components/SampleFilter/SampleFilter';
import './samples.scss'

function Samples() {
    const [allSamples, setAllSamples] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filteredSamples, setFilteredSamples] = useState(undefined)
    const [showFilter, setShowFilter] = useState(false)

    useEffect(() => {
        apiClient.get("/samples").then((result) => {
            setAllSamples(result.data)
        }).catch((err) => console.log("Error when trying to get projects from server.", err)).finally(() => setIsLoading(false))
    }, [])

    function toggleFilter() {
        setShowFilter(!showFilter)
    }

    if (isLoading) {
        return <Loading />
    }

    return (
        <div>
            <h2>All available samples</h2>
            <Link to="/samples/create">
                <button>Post your sample</button>
            </Link>
            <button onClick={toggleFilter} style={{ backgroundColor: "#63A18F" }}>{showFilter ? "hide filter" : "show filter"}</button>

            {showFilter ? <SampleFilter allSamples={allSamples} sendToParent={setFilteredSamples} /> : ""}

            <div>{filteredSamples ? <div><strong>{filteredSamples.length}</strong> sample{filteredSamples.length > 1 ? "s" : ""} meet{filteredSamples.length === 1 ? "s" : ""} your criteria</div> : ""}</div>

            <div className="samples-container">
                {filteredSamples && filteredSamples.map(samp => {
                    return <SampleCard key={samp._id} sampleInfo={samp} backgroundColor="lightBlue" />
                })}
                {!filteredSamples && allSamples.map(samp => {
                    return <SampleCard key={samp._id} sampleInfo={samp} backgroundColor="yellow" />
                })}
            </div>
        </div>
    )
}

export default Samples