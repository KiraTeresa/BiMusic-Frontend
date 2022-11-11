import "./sampleCard.scss";
import { Link } from "react-router-dom";
import Audio from "../Audio/Audio";

function SampleCard({ sampleInfo, backgroundColor }) {
    const { linkType, title, uploadedLink, link, genre } = sampleInfo;
    // let sample;
    let embededCode;

    if (linkType === "url") {
        const embededCodeTest = link.split('=')[1];
        embededCode = embededCodeTest.split('&')[0];
        // sample = () => {
        //     return (
        //         <iframe style={{ width: "560px", height: "315px" }} src={`https://www.youtube.com/embed/${embededCode}`} title={title} frameBorder="0"></iframe>
        //     )
    }
    // } else if (linkType === "upload") {
    //     sample = () => {
    //         return (
    //             <audio controls >
    //                 <source src={uploadedLink} />
    //             </audio>
    //         )
    //     }
    // }
    return (
        <div className="sample-card-container">
            {/* <p className="title">{title}</p> */}
            {/* <p>{genre}</p> */}
            {/* <div style={{ backgroundColor: backgroundColor }}> */}
            {linkType === "url" ?
                <div className="iframe-container">
                    <iframe className="responsive-iframe" src={`https://www.youtube.com/embed/${embededCode}`} title={title} frameBorder="0"></iframe> </div>
                : linkType === "upload" ?
                    <Audio link={uploadedLink} songName={title} />
                    : "- no sample found -"
            }
            {/* </div> */}
        </div>
    )
}

export default SampleCard