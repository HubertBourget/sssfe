import React, { useEffect, useState } from 'react';
import Axios from 'axios';

function ArtistVideos(props) {
    const artistId = props.artistId;
    const [contentDocuments, setContentDocuments] = useState([]);

    useEffect(() => {
        const fetchContentByArtist = async () => {
            try {
                console.log('Artist ID:', artistId);
                const encodedArtistId = encodeURIComponent(artistId);
                const response = await Axios.get(`https://jellyfish-app-tj9ha.ondigitalocean.app/api/getContentByArtist?artistId=${encodedArtistId}`);
                console.log('Response:', response); // Log the entire response
                if (response.status === 200) {
                    const fetchedContentDocuments = response.data; //.contentDocuments
                    setContentDocuments(fetchedContentDocuments);
                    console.log('Fetched Content Documents:', fetchedContentDocuments); // Log the fetched data
                } else {
                    console.error(`Request failed with status: ${response.status}`);
                }
            } catch (error) {
                console.error(`An error occurred: ${error}`);
            }

        };

        // Call the function to fetch content by artist when the component mounts
        fetchContentByArtist();
    }, [artistId]); // Make sure to include artistId in the dependencies array

    return (
        <>
            <div>
                {/* Check if contentDocuments is defined before mapping */}
                {contentDocuments && contentDocuments.map((contentDocument) => (
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
