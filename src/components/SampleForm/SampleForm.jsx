import { useState } from "react"
import GENRE_ENUM from "../../consts/genreEnum"

function SampleForm(props) {
    const currentYear = new Date().getFullYear()
    const [form, setForm] = useState({
        title: "",
        link: "",
        linkType: "",
        isPublic: true,
        artist: "This will be changed to the ID of the current user!!!", // <-- CHANGES NEED TO BE MADE HERE
        description: "",
        genre: [],
        year: "",
        feedback: [],
    });
    const [genreArr, setGenreArr] = useState([])

    const { disableSubmit } = props;
    console.log("PROP? ", disableSubmit)

    function handleChange(e) {
        const { name, value } = e.target;

        setForm({ ...form, [name]: value })
    }

    function handleCheckboxChange(e) { // <<<<Function also in projects-create.js
        setArrayValues(e.target, genreArr, setGenreArr);
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

        // TO DO -->
        // apiClient.post("/samples/create", form).then(console.log).catch(console.error)
    }

    return (<div>
        <h2>Form to add a new sample</h2>
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
            {/* isPublic */}
            <label>Do you want this sample to be shown on your profile?
                <label>
                    <input type="radio" onChange={handleChange} name="isPublic" value="yes"></input> Yes, add sample to my profile
                </label>
                <label>
                    <input type="radio" onChange={handleChange} name="isPublic" value="no"></input> No, show only at the project
                </label>
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