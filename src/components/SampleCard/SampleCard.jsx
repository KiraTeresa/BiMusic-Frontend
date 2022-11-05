function SampleCard({ sampleInfo, backgroundColor }) {
    const { linkType, title, uploadedLink, link } = sampleInfo;
    let sample;
    if (linkType === "url") {
        const embededCodeTest = link.split('=')[1];
        const embededCode = embededCodeTest.split('&')[0];
        sample = () => {
            return (
                <iframe style={{ width: "560px", height: "315px" }} src={`https://www.youtube.com/embed/${embededCode}`} title={title} frameBorder="0"></iframe>
            )
        }
    } else if (linkType === "upload") {
        sample = () => {
            return (
                <audio controls >
                    <source src={uploadedLink} />
                </audio>
            )
        }
    }
    return (
        <div>
            <h4>{sample.genre}</h4>
            <h4>{title}</h4>
            <div style={{ backgroundColor: backgroundColor }}>
                {sample()}
            </div>
        </div>
    )
}

export default SampleCard