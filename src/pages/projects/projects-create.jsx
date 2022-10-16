import { useState } from "react";
import GENRE_ENUM from "../../consts/genreEnum"
import SKILL_ENUM from "../../consts/skillEnum"
import { format } from "date-fns"

function ProjectsCreate() {
    const [form, setForm] = useState({
        title: "",
        shortDescription: "",
        longDescription: "",
        genre: [],
        lookingFor: [],
        startDate: format(new Date(), 'yyyy-MM-dd'),
        endDate: format(new Date(), 'yyyy-MM-dd'),
        isRemote: false,
        city: "",
        country: "",
        initiator: "This will be changed to the ID of the current user!!!", // <-- CHANGES NEED TO BE MADE HERE
        sample: "will be a sample ID", // <-- CHANGES NEED TO BE MADE HERE
    })
    const [genreArr, setGenreArr] = useState([])
    const [skillArr, setSkillArr] = useState([])

    function handleChange(e) {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value })
    }
    console.log("---------")
    console.log("Genre: ", genreArr)
    console.log("Skill: ", skillArr)
    console.log("---------")

    function handleGenreCheckbox(e) {
        const { value, checked } = e.target;

        if (checked) {
            setGenreArr([...genreArr, value])
        }
        else {
            const newGenreArr = genreArr.filter(e => e !== value)
            setGenreArr(newGenreArr)
        }
    }

    function handleSkillCheckbox(e) {
        const { value, checked } = e.target;

        if (checked) {
            setSkillArr([...skillArr, value])
        }
        else {
            const newSkillArr = skillArr.filter(e => e !== value)
            setSkillArr(newSkillArr)
        }
    }

    function handleSubmit(e) {
        e.preventDefault();

        console.log("FORM --> ", form)
    }

    return (
        <div>
            <h2>Form to create a new project</h2>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
                <label>Title
                    <input onChange={handleChange} value={form.title} type="text" name="title"></input>
                </label>
                <label>Give a briefe description of your idea:
                    <input onChange={handleChange} value={form.shortDescription} type="text" name="shortDescription"></input>
                </label>
                <label>Now you can explain in more detail:
                    <textarea onChange={handleChange} value={form.longDescription} type="text" name="longDescription"></textarea>
                </label>
                <label>Which genre will your project be?</label>
                {GENRE_ENUM.map((genre) => {
                    return <label key={genre}><input onChange={handleGenreCheckbox} type="checkbox" name="genre" value={genre}></input>{genre}</label>
                })}
                <label>Who are you looking for?</label>
                {SKILL_ENUM.map((skill) => {
                    return <label key={skill}><input onChange={handleSkillCheckbox} type="checkbox" name="lookingFor" value={skill}></input>{skill}</label>
                })}
                <label>When do you wanna start?
                    <input onChange={handleChange} value={form.startDate} type="date" name="startDate"></input>
                </label>
                <label>Wnen will it be over?
                    <input onChange={handleChange} value={form.endDate} type="date" name="endDate"></input>
                </label>
                <label>Will you connect online?
                    <input onChange={handleChange} value={form.isRemote} type="text" name="isRemote"></input>
                </label>
                <label>Select a city:
                    <input onChange={handleChange} value={form.city} type="text" name="city"></input>
                </label>
                <label>Select the country
                    <input onChange={handleChange} value={form.country} type="text" name="country"></input>
                </label>
                <label>Do you want to add a sample?
                    <input onChange={handleChange} value={form.sample} type="text" name="sample"></input>
                </label>
                <button type="submit">Create</button>
            </form>
        </div >
    )
}

export default ProjectsCreate;