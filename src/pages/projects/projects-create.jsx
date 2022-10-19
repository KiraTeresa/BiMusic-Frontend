import { useEffect, useState } from "react";
import GENRE_ENUM from "../../consts/genreEnum"
import SKILL_ENUM from "../../consts/skillEnum"
import { format } from "date-fns"
import axios from "axios";
import CreateSample from "../../components/CreateSample/CreateSample"
import apiClient from "../../services/apiClient";
import { useAuth } from "../../context/auth.context";
import Loading from "../../components/Loading/Loading";
import { useNavigate } from "react-router-dom";

function ProjectsCreate() {
    const { user } = useAuth() // <-- returns logged-in user (_id, email, name) << useEffect??
    console.log("USER INFO --> ", user)
    const [form, setForm] = useState({
        title: "",
        shortDescription: "",
        longDescription: "",
        genre: [],
        lookingFor: [],
        startDate: format(new Date(), 'yyyy-MM-dd'),
        endDate: format(new Date(), 'yyyy-MM-dd'),
        isRemote: false,
        city: "", // <-- dropdown via api like for countries?
        country: "", // <-- not happy with the current solution, might change it
        initiator: user._id,
        addSample: false,
        // sample: "will be a sample ID", // <-- CHANGES NEED TO BE MADE HERE
    })
    const [genreArr, setGenreArr] = useState([])
    const [skillArr, setSkillArr] = useState([])
    const [countries, setCountries] = useState([])
    // const [user, setUser] = useState(undefined)
    const [isLoading, setIsLoading] = useState(true)

    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get(`https://restcountries.com/v3.1/all`)
            .then(response => {
                setCountries(response.data)
            })
            .catch(err => console.log(err)).finally(() => setIsLoading(false));
    }, [])

    function handleChange(e) {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value })
    }

    function handleCheckboxChange(e) { // <<<<Function also in CreatSample.jsx
        const { name, checked } = e.target;

        switch (name) {
            case "genre":
                setArrayValues(e.target, genreArr, setGenreArr);
                break;
            case "lookingFor":
                setArrayValues(e.target, skillArr, setSkillArr);
                break;
            case "isRemote":
            case "addSample":
                setForm({ ...form, [name]: checked });
                break;
            default:
                console.log(`No case matching ${name}, sorry.`)
        }
    }

    function setArrayValues(target, arr, setArr) { // <<<<Function also in CreatSample.jsx
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
        console.log("FORM --> ", form)

        apiClient.post("/projects/create", form).then((res) => {
            navigate(`/projects/${res.data}`)
        }).catch(console.error)
    }

    if (isLoading) {
        return <Loading />
    }

    return (
        <div>
            <h2>Form to create a new project</h2>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
                {/* Title */}
                <label>Title
                    <input onChange={handleChange} value={form.title} type="text" name="title"></input>
                </label>
                {/* Short Description */}
                <label>Give a briefe description of your idea:
                    <input onChange={handleChange} value={form.shortDescription} type="text" name="shortDescription" maxLength="150"></input>
                </label>
                {/* Long Description */}
                <label>Now you can explain in more detail:
                    <textarea onChange={handleChange} value={form.longDescription} type="text" name="longDescription" minLength="200" maxLength="1000"></textarea>
                </label>
                {/* Genre */}
                <label>Which genre will your project be?</label>
                {GENRE_ENUM.map((genre) => {
                    return <label key={genre}><input onChange={handleCheckboxChange} type="checkbox" name="genre" value={genre}></input>{genre}</label>
                })}
                {/* Looking For (Skills) */}
                <label>Who are you looking for?</label>
                {SKILL_ENUM.map((skill) => {
                    return <label key={skill}><input onChange={handleCheckboxChange} type="checkbox" name="lookingFor" value={skill}></input>{skill}</label>
                })}
                {/* Start Date */}
                <label>When do you wanna start?
                    <input onChange={handleChange} value={form.startDate} type="date" name="startDate"></input>
                </label>
                {/* End Date */}
                <label>Wnen will it be over?
                    <input onChange={handleChange} value={form.endDate} type="date" name="endDate"></input>
                </label>
                {/* Remote? */}
                <label>Will you connect online?
                    <input onChange={handleCheckboxChange} value={form.isRemote} type="checkbox" name="isRemote"></input>
                </label>

                {/* TO DO ----> */}
                {/* City */}
                <label>Select a city:
                    <input onChange={handleChange} value={form.city} type="text" name="city" disabled={form.isRemote}></input>
                </label>
                {/* Country */}
                {/* <label>Select the country */}
                {/* <input onChange={handleChange} value={form.country} type="text" name="country" disabled={form.isRemote}></input> */}
                {/* </label> */}
                <select name="country" onChange={handleChange} disabled={form.isRemote}>
                    <option value="">-- Select the country --</option>
                    {countries.map(country => {
                        return <option key={country.name.common} value={country.name.common}>{country.name.common}</option>
                    })}
                </select>
                {/* <---- TO DO */}

                {/* TO DO ----> */}
                {/* Sample */}
                <label>Do you want to add a sample?
                    <input onChange={handleCheckboxChange} value={form.addSample} type="checkbox" name="addSample"></input>
                </label>
                {/* <---- TO DO */}

                <button type="submit">Create</button>
            </form>
            {form.addSample ? <div style={{ backgroundColor: "grey" }}><CreateSample /></div> : ""}
        </div >
    )
}

export default ProjectsCreate;