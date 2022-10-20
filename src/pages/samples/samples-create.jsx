import { useEffect, useState } from "react"
import SampleForm from "../../components/SampleForm/SampleForm"
import apiClient from "../../services/apiClient"
import Loading from "../../components/Loading/Loading"
import { useLocation } from "react-router-dom"

function SamplesCreate() {
    const [data, setData] = useState({})
    const [addedToProject, setAddedToProject] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const location = useLocation();
    console.log("LOCATION: ", location.state)

    useEffect(() => {
        apiClient.get(`/samples/create/?projectId=${location.state}`).then((response) => {
            console.log("RESPONSE FROM SERVER --> ", response.data);
            setAddedToProject(response.data)
        }).catch((err) => console.log("ERR: ", err)).finally(() => setIsLoading(false));
    }, [])

    if (isLoading) {
        return <Loading />
    }

    return (
        <div>
            {addedToProject ? <h2>Add a sample to your Project <span style={{ color: "blue" }}>{addedToProject.title}</span></h2> : <h2>Form to add a new sample</h2>}

            <SampleForm addedToProject={addedToProject._id} />
        </div>
    )
}

export default SamplesCreate