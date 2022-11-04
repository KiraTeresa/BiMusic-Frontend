import "./SampleForm.css";
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import GENRE_ENUM from "../../consts/genreEnum"
import { useAuth } from "../../context/auth.context";
import apiClient from "../../services/apiClient";
import axios from "axios";
import Loading from "../../components/Loading/Loading";

function SampleForm(props) {
    const { user } = useAuth() // <-- returns logged-in user (_id, email, name) << useEffect??
    const currentYear = new Date().getFullYear()
    const [form, setForm] = useState({
        title: "",
        link: "",
        linkType: "",
        public: true,
        artist: user && user._id,
        description: "",
        genre: [],
        year: "",
        feedback: [],
        uploadedLink: ""
    });
    const [uploadedFile, setUploadedFile] = useState(null);
    const [genreArr, setGenreArr] = useState([])
    const [errorMessage, setErrorMessage] = useState(undefined)
    const [isLoading, setIsLoading] = useState(false);

    const { disableSubmit, projectId } = props;
    // console.log("Props: ", props)

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

    async function handleSubmit(e) {
        try {
            e.preventDefault();
            if (sampleType === "upload") {
                const formData = new FormData();
                formData.append("file", uploadedFile);
                formData.append("upload_preset", process.env.REACT_APP_UPLOAD_PRESET);
                setIsLoading(true);
                const response = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/upload`, formData);
                console.log(response);
                const finalForm = { ...form, year: parseInt(form.year), uploadedLink: response.data.url, linkType: "upload" }
                console.log("SAMPLE --> ", finalForm);
                const res = await apiClient.post("/samples/create", { finalForm, projectId })
                console.log("RES FROM BACKEND: ", res)
                setIsLoading(false);
                navigate('/profile')
            } else {
                console.log("SAMPLE --> ", form)
                const finalForm = { ...form, year: parseInt(form.year), linkType: "url" }
                const res = await apiClient.post("/samples/create", { finalForm, projectId })
                console.log("RES FROM BACKEND: ", res)
                navigate('/profile')
            }
        } catch (err) {
            console.log(err);
            const errorDescription = err.response.data.message;
            setErrorMessage(errorDescription);
        }
    }

    function showTogglePrivacy() {
        return (
            <label>Do you want this sample to be shown on your profile?
                <label>
                    <input type="radio" onChange={handleChange} name="public" value={true}></input> Yes, add sample to my profile
                </label>
                <label>
                    <input type="radio" onChange={handleChange} name="public" value={false}></input> No, show only at the project
                </label>
            </label>
        )
    }

    const [sampleType, setSampleType] = useState("url")
    const handleSampleType = (e) => {
        setSampleType(e.target.value);
    }

    function upload(e) { setUploadedFile(e.target.files[0]) }

    if (isLoading) {
        return <Loading />
    }

    return (
        <div className="upload__form__c">
          <div className="up__f__c">
          <div className="upload__title">Upload Track</div>


        <div style={{ display: "flex", flexDirection: "column" }} >
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>

                
                {/* Title */}
                <label className= "label-title"><b>Title</b><span class="required">*</span>
                    <input className="upload__inputs" placeholder="Name your track" type="text" onChange={handleChange} name="title" value={form.title}></input>
                    </label>
                {/* Description */}
                <label className= "label-title"><b>Description</b><i> {"(optional)"}</i>
                    <textarea className="textarea__input" placeholder="Describe your track" type="text" onChange={handleChange} name="description" value={form.description} maxLength="500"></textarea>
                </label>
                {/* Year */}
                <label className= "label-title"><b>Publication year</b><span class="required">*</span>: 
                    <input placeholder="Select release year" className="year__input" type="number" onChange={handleChange} name="year" min="1960" max={currentYear} step="1" value={form.year}></input>
                </label>
                {/* Genre */}
                    <label className= "tags-title-label"><b>Add tags to characterise the genre of your song:</b><i> {"(optional)"}</i>
                    <div class="container-genres">
                <div className="checkbox-genres-wrapper">
                    <p>{GENRE_ENUM.map((genre) => {
                        return <label key={genre}>
                        <input id="checkbox-rect1" onChange={handleCheckboxChange} type="checkbox" name="genre" value={genre}></input>{genre}
                    </label>
                    
                    })}</p></div>
                    </div>
                    </label>

                {/* Link Type */}
                <label className= "label-title"><b>Select upload type:   </b><span class="required">*</span>  
                <label>
                        <input type="radio" onChange={handleSampleType} name="linkType" value="url" defaultChecked="true" /><i>URL</i>
                    </label>
                    <label>
                        <input type="radio" onChange={handleSampleType} name="linkType" value="upload" /> <i>Upload audio file</i>
                    </label>
            

                {/* Link */}
                {/* Upload Sample */}


                    {sampleType === "url" ?
                        <input className="upload_referenceLink"  placeholder="Paste reference link here" type="url" onChange={handleChange} name="link" value={form.link} />
                        :
                        <input type="file" onChange={upload} accept="audio/wav, audio/mp3" />
                    }
        </label>

        <div>

             {/* Public */}
             {/* {projectId ? showTogglePrivacy : <div><i>Samples, which are not attached to a project are always pupblic.</i></div>} */}
        </div>


                {disableSubmit ? "" : <button className="uploadBtn" type="submit">Submit </button>}
            </form>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            
            
            <p className="required-fields">
    <span class="required">*</span>Required fields
  </p>
        </div>
        </div>
        </div>
    )
}

export default SampleForm;