import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns"
import axios from "axios";
import './ProjectsForm.scss'

import GENRE_ENUM from "../../consts/genreEnum"
import SKILL_ENUM from "../../consts/skillEnum"
import apiClient from "../../services/apiClient";
import { useAuth } from "../../context/auth.context";
import Loading from "../../components/Loading/Loading";

function ProjectsCreate() {
    const { user } = useAuth() // <-- returns logged-in user (_id, email, name) << useEffect??
    // console.log("USER INFO --> ", user)
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
        initiator: user._id,
        addSample: false,
    })
    const [genreArr, setGenreArr] = useState([])
    const [skillArr, setSkillArr] = useState([])
    const [countriesAndCities, setCountriesAndCities] = useState([])
    const [citiesList, setCitiesList] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState(undefined)

    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get(`https://countriesnow.space/api/v0.1/countries`)
            .then(response => {
                const resArray = response.data.data;
                setCountriesAndCities(resArray)

                apiClient.get(`/projects/create?userId=${user._id}`).then((result) => {
                    // console.log("Info from backend: ", result);
                    const { data } = result;

                    if (Object.keys(data).length > 0) {
                        const { city, country } = result.data;
                        setForm({ ...form, city, country })

                        const findCountry = resArray.find((element) => element.country === country)

                        if (findCountry) {
                            setCitiesList(findCountry.cities)
                        }

                    } else {
                        setCitiesList(resArray[0].cities)
                        // console.log("First element: ", resArray[0])
                    }
                })
            }).catch((err) => {
                if (err.response.status === 500) {
                    navigate('/internal-server-error')
                } else { console.log(err) }
            }).finally(() => setIsLoading(false));
    }, [user._id])

    function handleChange(e) {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value })
        // console.log("NEW --> ", name, " ", value)
    }

    function handleCountryChange(e) {
        const { name, value } = e.target;

        const findCountry = countriesAndCities.find((element) => element.country === value)
        const cityArr = findCountry.cities

        setCitiesList(cityArr)
        setForm({ ...form, [name]: value, city: cityArr[0] })
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
        // console.log("FORM --> ", form)
        let finalForm;

        if (form.isRemote) {
            finalForm = { ...form, city: "", country: "" }
        } else {
            finalForm = { ...form }
        }

        // console.log("Final Form: ", finalForm)

        apiClient.post("/projects/create", finalForm).then((res) => {
            // console.log("THE RES --> ", res)
            // console.log("ID of new project: --> ", res.data)
            if (!res.data) {
                console.log("Missing input.")
            }
            if (form.addSample) {
                navigate(`/samples/create`, { state: res.data })
            } else {
                navigate(`/projects/${res.data}`)
            }
        }).catch((err) => {
            console.log("AN ERROR --> ", err)
            if (err.response.status === 500) {
                navigate('/internal-server-error')
            } else {
                const errorDescription = err.response.data.message;
                setErrorMessage(errorDescription);
            }
        })
    }

    if (isLoading) {
        return <Loading />
    }

    return (
        <div className="upload__form__c-proj">
            <div className="upload__title">Publish your collab request</div>
            <div className="up__f__c">
                <div className='gradient'></div>
                <div style={{ display: "flex", flexDirection: "column" }} >
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
                        {/* Title */}
                        <label className="label-title"><b>Title</b><span className="required">*</span>
                            <input className="upload__inputs" placeholder="Name your project" onChange={handleChange} value={form.title} type="text" name="title" maxLength="50"></input>
                        </label>
                        {/* Short Description */}
                        <label className="label-title"><b>Short Description</b><span className="required">*</span>
                            <input className="upload__inputs" placeholder="Give a brief description of your project idea" onChange={handleChange} value={form.shortDescription} type="text" name="shortDescription" maxLength="150"></input>
                        </label>
                        {/* Long Description */}
                        <label className="label-title"><b>Long Description</b><span className="required">*</span>
                            <textarea placeholder="Describe your project in more detail" className="textarea__input" onChange={handleChange} value={form.longDescription} type="text" name="longDescription" minLength="200" maxLength="1000"></textarea>
                        </label>
                        {/* Genre */}
                        <label className="label-title"><b>What genre will your project be?</b><span className="required">*</span>
                            <div className="container-genres">
                                <div className="checkbox-genres-wrapper">
                                    {GENRE_ENUM.map((genre) => {
                                        return <label key={genre} className="genre-upload-track"><input id="checkbox-rect1" onChange={handleCheckboxChange} type="checkbox" name="genre" value={genre}></input>{genre}</label>
                                    })}
                                </div>
                            </div>
                        </label>
                        {/* Looking For (Skills) */}
                        <label className="label-title"><b>Who are you looking for?</b><span className="required">*</span>
                            <div className="container-genres">
                                <div className="checkbox-genres-wrapper">
                                    {SKILL_ENUM.map((skill) => {
                                        return <label key={skill} className="genre-upload-track"><input id="checkbox-rect1" onChange={handleCheckboxChange} type="checkbox" name="lookingFor" value={skill}></input>{skill}</label>
                                    })}</div>
                            </div>
                        </label>
                        {/* Start Date */}
                        <label className="label-title"><span className="emojis">🚀 </span><b>When do you plan to start?  </b>
                            <input className="year__input" onChange={handleChange} value={form.startDate} min="today" type="date" name="startDate"></input>
                        </label>
                        {/* End Date */}
                        <label className="label-title"><span className="emojis">🏁 </span><b>When do you plan to finish your project?</b>
                            <input className="year__input" onChange={handleChange} value={form.endDate} min={form.startDate} type="date" name="endDate"></input>
                        </label>
                        {/* Remote? */}
                        <label className="project-create-check"><b><span className="emojis">🌎 </span>Would you prefer to collaborate online? </b>
                            <input onChange={handleCheckboxChange} value={form.isRemote} type="checkbox" name="isRemote"></input>
                        </label>

                        {/* Country */}
                        <label className="label-title"><b>Select your country location</b>
                            <select className="upload__inputs" name="country" onChange={handleCountryChange} disabled={form.isRemote}>
                                <option value={form.country}>{form.country}</option>
                                {countriesAndCities.map((element, index) => {
                                    return <option key={index} value={element.country}>{element.country}</option>
                                })}
                            </select>
                        </label>
                        {/* City */}
                        <label className="label-title"><b>Select your city location</b>
                            <select className="upload__inputs" name="city" onChange={handleChange} disabled={form.isRemote}>
                                <option value={form.city}>{form.city}</option>
                                {citiesList.map(city => {
                                    return <option key={city} value={city}>{city}</option>
                                })}
                            </select>
                        </label>
                        {/* Sample */}
                        <label className="project-create-check"><b>Would you like to upload a sample? </b>
                            <input onChange={handleCheckboxChange} value={form.addSample} type="checkbox" name="addSample"></input>
                        </label>

                        <button className="btn primary" type="submit">Publish</button>
                    </form>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <p className="required-fields">
                        <span className="required">*</span>Required fields
                    </p>
                </div >
            </div >
        </div >
    )
}

export default ProjectsCreate;