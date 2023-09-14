import React, { useEffect, useState } from 'react';
import Axios from 'axios';

function ArtistVideos(props) {
    const artistId = props.artistId;
    console.log(artistId);
    const [contentDocuments, setContentDocuments] = useState([]);

    useEffect(() => {
        const fetchContentByArtist = async () => {
            try {
                const response = await Axios.get(`/api/getContentByArtist`) //?artistId=${artistId}


                if (response.status === 200) {
                    const fetchedContentDocuments = response.data.contentDocuments;
                    setContentDocuments(fetchedContentDocuments);
                } else {
                    console.error(response.statusText);
                }
            } catch (error) {
                console.error(error);
            }
        };

        // Call the function to fetch content by artist when the component mounts
        fetchContentByArtist();
    }, [artistId]); // Make sure to include artistId in the dependencies array

    return (
        <>
            <div>
                HOLA
                {/* Render contentDocuments here */}
                {contentDocuments.map((contentDocument) => (
                    <div key={contentDocument.videoId}>
                        {/* Render contentDocument details */}
                        <h2>{contentDocument.title}</h2>
                        <p>{contentDocument.description}</p>
                        {/* Add more contentDocument fields as needed */}
                    </div>
                ))}
            </div>
        </>
    );
}

export default ArtistVideos;
