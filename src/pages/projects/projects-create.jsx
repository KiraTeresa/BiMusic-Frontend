import { useEffect, useState } from "react";
import GENRE_ENUM from "../../consts/genreEnum"
import SKILL_ENUM from "../../consts/skillEnum"
import { format } from "date-fns"
import axios from "axios";
import CreateSample from "../../components/CreateSample/CreateSample"
import apiClient from "../../services/apiClient";
import { useAuth } from "../../context/auth.context";
import Loading from "../../components/Loading/Loading";

function ProjectsCreate() {
    const user = useAuth()
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
        country: "",
        initiator: user._id,
        addSample: false,
        // sample: "will be a sample ID", // <-- CHANGES NEED TO BE MADE HERE
    })
    const [genreArr, setGenreArr] = useState([])
    const [skillArr, setSkillArr] = useState([])
    const [countries, setCountries] = useState([])
    // const [user, setUser] = useState(undefined)
    const [isLoading, setIsLoading] = useState(true)



    // console.log("USER --> ", aUser.user)

    // console.log("HEADER --> ")

    // useEffect(() => {
    //     apiClient.get("/projects/create").then((result) => console.log("From Server: ", result)).catch(err => console.log(err))
    // }, [])

    useEffect(() => {
        axios
            .get(`https://restcountries.com/v3.1/all`)
            .then(response => {
                setCountries(response.data)
                // console.log('Response from API is: ', response);
                // const countryDetail = response.data[0];
                // console.log('a single country details: ', countryDetail);
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

    // function handleGenreCheckbox(e) {
    //     const { name, value, checked } = e.target;

    //     if (checked) {
    //         setGenreArr([...genreArr, value])
    //         setForm({ ...form, [name]: [...genreArr, value] })
    //     }
    //     else {
    //         const newGenreArr = genreArr.filter(e => e !== value)
    //         setGenreArr(newGenreArr)
    //         setForm({ ...form, [name]: newGenreArr })
    //     }
    // }

    // function handleSkillCheckbox(e) {
    //     const { name, value, checked } = e.target;

    //     if (checked) {
    //         setSkillArr([...skillArr, value])
    //         setForm({ ...form, [name]: [...skillArr, value] })
    //     }
    //     else {
    //         const newSkillArr = skillArr.filter(e => e !== value)
    //         setSkillArr(newSkillArr)
    //         setForm({ ...form, [name]: newSkillArr })
    //     }
    // }

    function handleSubmit(e) {
        e.preventDefault();
        console.log("FORM --> ", form)

        // TO DO -->
        // create api-client.js in services, set baseURL etc
        // 
        apiClient.post("/projects/create", form).then(console.log).catch(console.error)
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
                {/* Sample */}
                <label>Do you want to add a sample?
                    <input onChange={handleCheckboxChange} value={form.addSample} type="checkbox" name="addSample"></input>
                </label>

                <button type="submit">Create</button>
            </form>
            {form.addSample ? <div style={{ backgroundColor: "grey" }}><CreateSample /></div> : ""}
        </div >
    )
}

export default ProjectsCreate;