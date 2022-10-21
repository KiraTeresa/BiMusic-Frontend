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
        console.log("Hi THERE");

        if (location.state) {
            console.log("Gotya")
            getProjectInfo()
        } else {
            console.log("Nah")
            createWithoutProject()
        }

    }, [location.state])

    function getProjectInfo() {
        apiClient.get(`/samples/create/?projectId=${location.state}`).then((response) => {
            console.log("RESPONSE FROM SERVER --> ", response.data);
            setAddedToProject(response.data)
        }).catch((err) => console.log("ERR: ", err)).finally(() => setIsLoading(false))
    }

    function createWithoutProject() {
        apiClient.get(`/samples/create`).then((response) => {
            console.log("RESPONSE FROM SERVER --> ", response.data);
        }).catch((err) => console.log("ERR: ", err)).finally(() => setIsLoading(false))
    }

    if (isLoading) {
        return <Loading />
    }

    if (addedToProject) {
        return (
            <div>
                <h2>Add a sample to your Project <span style={{ color: "blue" }}>{addedToProject.title}</span></h2>
                <SampleForm projectId={addedToProject._id} />
            </div>
        )
    }

    return (
        <div>
            <h2>Form to add a new sample</h2>
            <SampleForm />
        </div>
    )
}

export default SamplesCreate