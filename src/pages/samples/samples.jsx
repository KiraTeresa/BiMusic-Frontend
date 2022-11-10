import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import apiClient from '../../services/apiClient'
import Loading from '../../components/Loading/Loading';
// import SampleCard from '../../components/SampleCard/SampleCard';
import SampleFilter from '../../components/SampleFilter/SampleFilter';
import './samples.scss'

function Samples() {
    const [allSamples, setAllSamples] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filteredSamples, setFilteredSamples] = useState(undefined)
    const [showFilter, setShowFilter] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        apiClient.get("/samples").then((result) => {
            setAllSamples(result.data)
        }).catch((err) => {
            if (err.response.status === 500) {
                navigate('/internal-server-error')
            } else {
                console.log(err)
            }
        }).finally(() => setIsLoading(false))
    }, [])

    function toggleFilter() {
        setShowFilter(!showFilter)
    }

    if (isLoading) {
        return <Loading />
    }

    return (
        <div className='projects-container'>
            <div className='head'>
                <h2>All available samples</h2>
                <Link to="/samples/create">
                    <button className='btn primary'>Post your sample</button>
                </Link>
            </div>

            <div className='filter-wrapper'>
                <button className='btn secondary filter-btn' onClick={toggleFilter}>{showFilter ? "hide filter" : "show filter"}</button>

                {showFilter ? <SampleFilter allSamples={allSamples} sendToParent={setFilteredSamples} /> : ""}

                <div>{filteredSamples ? <div><strong>{filteredSamples.length}</strong> sample{filteredSamples.length > 1 ? "s" : ""} meet{filteredSamples.length === 1 ? "s" : ""} your criteria</div> : ""}</div>
            </div>

            <div className="samples-container">
                <table className="styled-table">
                    <thead>
                        <tr>
                            <th>Initiator</th>
                            <th>Title</th>
                            <th>Genre</th>
                            <th>Publication Year</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSamples && filteredSamples.map(samp => {
                            return (
                                <tr key={samp._id}>
                                    <td>
                                        <Link to={`/profile/${samp.artist.name}`}>
                                            {samp.artist.name}
                                        </Link>
                                    </td>
                                    <td><Link to={`/samples/sample/${samp._id}`}>
                                        {samp.title}
                                    </Link>
                                    </td>
                                    <td>{samp.genre.map(ge => { return <p key={ge}>{ge}</p> })}</td>
                                    <td>{samp.year}</td>
                                </tr>)
                        })}
                        {!filteredSamples && allSamples.map(samp => {
                            return (<tr key={samp._id}>
                                <td><Link to={`/profile/${samp.artist.name}`}>
                                    {samp.artist.name}
                                </Link></td>
                                <td><Link to={`/samples/sample/${samp._id}`}>
                                    {samp.title}
                                </Link>
                                </td>
                                <td>{samp.genre.map(ge => { return <p key={ge}>{ge}</p> })}</td>
                                <td>{samp.year}</td>
                            </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Samples