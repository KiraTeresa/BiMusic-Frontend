import { useEffect, useState } from "react"
import SampleForm from "../../components/SampleForm/SampleForm"
import apiClient from "../../services/apiClient"
import Loading from "../../components/Loading/Loading"
import { useLocation } from "react-router-dom"

function SamplesCreate() {
    const [addedToProject, setAddedToProject] = useState(undefined)
    const [isLoading, setIsLoading] = useState(true)
    const location = useLocation();

    useEffect(() => {
        // console.log("Hi THERE");

        if (location.state) {
            console.log("Gotya")
            apiClient.get(`/samples/create/?projectId=${location.state}`).then((response) => {
                // console.log("RESPONSE FROM SERVER --> ", response.data);
                setAddedToProject(response.data)
            }).catch((err) => console.log("ERR: ", err)).finally(() => setIsLoading(false))
        } else {
            setIsLoading(false)
        }

    }, [location.state])

    if (isLoading) {
        return <Loading />
    }

    if (addedToProject) {
        return (
            <div>
                {addedToProject ?
                    <h2>Add a sample to your Project <span className="samp-proj-title">{addedToProject.title}</span></h2>
                    : ""
                }
                <SampleForm projectId={addedToProject._id} />
            </div>
        )
    }

    return (
        <SampleForm />
    )
}

export default SamplesCreate