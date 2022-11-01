function SampleCard({ sampleInfo }) {
    const { linkType, title, uploadedLink, link } = sampleInfo;
    let sample;

    if (linkType === "url") {
        const embededCode = link.split('=')[1]
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
            <h4>{title}</h4>
            <div>
                {sample()}
            </div>
        </div>
    )
}

export default SampleCard