import { useEffect } from "react";
import { useState } from "react"
import { useParams } from "react-router-dom";
import apiClient from "../../services/apiClient";

function CommentFeedbackForm({ props }) {
    const [form, setForm] = useState({ title: "", text: "" })
    const { id } = useParams()
    const { type, refreshPage } = props
    const [errorMessage, setErrorMessage] = useState(undefined);
    // console.log("Props: ", type, " + ", refreshPage)

    useEffect(() => {
        setForm({ title: "", text: "" })
    }, [])

    function handleChange(e) {
        const { name, value } = e.target
        setForm({ ...form, [name]: value })
        setErrorMessage(undefined)
    }

    function handleSubmit(e) {
        e.preventDefault();
        // console.log("New Comment/Feedback --> ", form)

        apiClient.post(`/${type}/${id}`, { form }).then((res) => {
            // console.log(res)
            setForm({ title: "", text: "" })
            refreshPage()
        }).catch((err) => {
            const errorDescription = err.response.data.message;
            setErrorMessage(errorDescription);
        })
    }

    return (
        <div className="form-wrapper">
            <form onSubmit={handleSubmit}>
                {type === "feedback" ?
                    <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="Feedback title"></input>
                    : ""}
                <textarea name="text" maxLength={500} value={form.text} onChange={handleChange} placeholder="Type your message here.."></textarea>
                <button className="btn secondary" type="submit">post {type}</button>
            </form>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    )
}

export default CommentFeedbackForm