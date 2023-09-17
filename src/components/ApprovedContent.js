import React, { useState, useEffect } from 'react';
import Axios from 'axios';

function ApprovedContent() {
    const [approvedContent, setApprovedContent] = useState([]);

    useEffect(() => {
        const fetchApprovedContent = async () => {
        try {
            const response = await Axios.get('https://jellyfish-app-tj9ha.ondigitalocean.app/api/getApprovedVideoContent'); 
            if (response.status === 200) {
                console.log("Approved Content Response:");
                console.log(response);
            setApprovedContent(response.data);
            } else {
            console.error(`Request failed with status: ${response.status}`);
            }
        } catch (error) {
            console.error(`An error occurred: ${error}`);
        }
        };

        // Call the function to fetch approved content when the component mounts
        fetchApprovedContent();
    }, []);

    return (
        <div>
        <h2>Approved Content</h2>
        <ul>
            {approvedContent.map((content) => (
            <li key={content._id}>
                <h3>{content.title}</h3>
                <p>Category: {content.category}</p>
                {/* Render other content details here */}
            </li>
            ))}
        </ul>
        </div>
    );
}

export default ApprovedContent;
