import { useEffect, useState } from "react"
import SampleForm from "../../components/SampleForm/SampleForm"
import apiClient from "../../services/apiClient"
import Loading from "../../components/Loading/Loading"
import { useLocation } from "react-router-dom"

function SamplesCreate() {
    const [data, setData] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const location = useLocation();
    console.log("LOCATION: ", location.state)

    useEffect(() => {
        apiClient.get(`/samples/create/?projectID=${location.state}`).then((response) => {
            console.log("RESPONSE FROM SERVER --> ", response)
        }).catch((err) => console.log("ERR: ", err)).finally(() => setIsLoading(false));
    }, [])

    if (isLoading) {
        return <Loading />
    }

    return (
        <div>
            <h2>Add a sample</h2>
            <SampleForm />
        </div>
    )
}

export default SamplesCreate