import { useState } from "react"
import { useNavigate } from "react-router-dom";
import GENRE_ENUM from "../../consts/genreEnum"
import { useAuth } from "../../context/auth.context";
import apiClient from "../../services/apiClient";

function SampleForm(props) {
    const { user } = useAuth() // <-- returns logged-in user (_id, email, name) << useEffect??
    const currentYear = new Date().getFullYear()
    const [form, setForm] = useState({
        title: "",
        link: "",
        linkType: "",
        public: false,
        artist: user._id,
        description: "",
        genre: [],
        year: "",
        feedback: [],
    });
    const [genreArr, setGenreArr] = useState([])

    const { disableSubmit, addedToProject } = props;

    const navigate = useNavigate();

    function handleChange(e) {
        const { name, value } = e.target;

        setForm({ ...form, [name]: value })
    }

    function handleCheckboxChange(e) { // <<<<Function also in projects-create.js
        const { name, checked } = e.target;

        switch (name) {
            case "genre":
                setArrayValues(e.target, genreArr, setGenreArr);
                break;
            case "public":
                setForm({ ...form, [name]: checked });
                break;
            default:
                console.log(`No case matching ${name}, sorry.`)
        }
    }

    function setArrayValues(target, arr, setArr) { // <<<<Function also in projects-create.js
        const { name, value, checked } = target;

        if (checked) {
            setArr([...arr, value])
            setForm({ ...form, [name]: [...arr, value] })
        }
        else {
            const newArr = arr.filter(e => e !== value)
            setArr(newArr)
            setForm({ ...form, [name]: newArr })
        }
    }

    function handleSubmit(e) {
        e.preventDefault();

        console.log("SAMPLE --> ", form)

        apiClient.post("/samples/create", { form, addedToProject }).then((res) => navigate('/profile')).catch(console.error)
    }

    return (<div style={{ display: "flex", flexDirection: "column" }} >
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
            {/* Title */}
            <label>What did you name this track?
                <input type="text" onChange={handleChange} name="title" value={form.title}></input>
            </label>
            {/* Link */}
            <label>Add the link to your sample:
                <input type="text" onChange={handleChange} name="link" value={form.link}></input>
            </label>
            {/* Link Type */}
            <label>Please select the type of link you just pasted:
                <label>
                    <input type="radio" onChange={handleChange} name="linkType" value="audio"></input> audio
                </label>
                <label>
                    <input type="radio" onChange={handleChange} name="linkType" value="video"></input> video
                </label>
            </label>
            {/* Public */}
            <label>Do you want this sample to be shown on your profile?
                <label>
                    <input type="checkbox" onChange={handleCheckboxChange} name="public"></input> {form.public ? "Yes, add sample to my profile" : "No, show only in project"}
                </label>
                {/* <label>
                    <input type="radio" onChange={handleChange} name="isPublic" value="no"></input> No, show only at the project
                </label> */}
            </label>
            {/* Description */}
            <label>Room to tell everyone more about this track:
                <textarea type="text" onChange={handleChange} name="description" value={form.description} maxLength="500"></textarea>
            </label>
            {/* Genre */}
            <div className="checkbox-wrapper">
                <label>Which genre describles the style of this track best?</label>
                {GENRE_ENUM.map((genre) => {
                    return <label key={genre}><input onChange={handleCheckboxChange} type="checkbox" name="genre" value={genre}></input>{genre}</label>
                })}</div>
            {/* Year */}
            <label>When did you publish this piece of art?
                <input type="number" onChange={handleChange} name="year" min="1900" max={currentYear} step="1" value={form.year}></input>
            </label>
            {disableSubmit ? "" : <button type="submit">add sample</button>}
        </form>
    </div>)
}

export default SampleForm;