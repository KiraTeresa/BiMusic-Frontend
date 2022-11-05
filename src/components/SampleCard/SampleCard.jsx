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
        <div>
            <h4>{genre}</h4>
            <h4>{title}</h4>
            <div style={{ backgroundColor: backgroundColor }}>
                {linkType === "url" ?
                    <iframe style={{ width: "560px", height: "315px" }} src={`https://www.youtube.com/embed/${embededCode}`} title={title} frameBorder="0"></iframe>
                    : linkType === "upload" ?
                        <audio controls >
                            <source src={uploadedLink} />
                        </audio> : "- no sample found -"
                }
            </div>
        </div>
    )
}

export default SampleCard