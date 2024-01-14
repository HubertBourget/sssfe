import React, { useState, useRef } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import FileProgressBar from './FileProgressBar';
import { v4 } from 'uuid';
import { storage } from '../../firebase';
import { ref } from 'firebase/storage';
import { getDownloadURL, uploadBytes } from 'firebase/storage';
import styled from 'styled-components';

const UploadDetailsForm = ({ file, progress, videoId, onTrackDetailChange }) => {
    //three of those now:
    const user = { name: "debug7e@debug.com" };

    const [coverImage, setcoverImage] = useState(null);
    const handleCoverChange = (event) => {
        if (event.target.files[0]) {
            const file = event.target.files[0];
            const imageUrl = URL.createObjectURL(file);
            setcoverImage(imageUrl); // Set the state with the URL
            uploadAlbumPicture(file); // Continue with your existing upload logic
        }
    };
const uploadAlbumPicture = (uploadingPicture) => {
        if (uploadingPicture == null) {
            console.log("profilePicture was null");
            return;
        }
        const fileUploadName = v4();
        const fileRef = ref(storage, `thumbnails/${user.name}/${fileUploadName}`);
        const metadata = {
            contentType: 'image/jpeg',
        };
        uploadBytes(fileRef, uploadingPicture, metadata)
            .then(() => {
            getDownloadURL(fileRef)
                .then((url) => {
                postCoverImage(url);
                setcoverImage(url); // Update the profilePicture state with the new URL
                })
                .catch((error) => {
                console.error(error);
                });
            })
            .catch((error) => {
            console.error(error);
            });
    };
    const postCoverImage = (url) => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/postCoverImage`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            videoId: videoId,
            coverImageUrl: url,
        }),
        })
        .then((res) => res.json())
        .then((data) => console.log(data));
    };


    //The form useState:
    const [formData, setFormData] = useState({
        title: file.title || '',
        description: file.description || '',
        tags: file.tags || '',
        category: file.category || '',
        visibility: file.visibility || 'public',
        selectedImageThumbnail: file.selectedImageThumbnail || '',
    });


//     const debouncedUpdate = debounce(async (data) => {
//     try {
//         if(!videoId) return;
//         console.log('Sending data:', { videoId, ...data });  // Log the data being sent
//         const response = await axios.post('https://monkfish-app-nb3ck.ondigitalocean.app/api/updatePartialContentMetaData', {
//             videoId: videoId,
//             ...data
//         });
//         console.log('Response:', response.data);
//     } catch (error) {
//         console.error('Error updating data:', error);
//     }
// }, 3000);


const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
        onTrackDetailChange(videoId, name, value);
    };


    return (
        <div style={{display:'flex', flexDirection:'column'}}>
            <FileProgressBar file={file.data} progress={progress} />
            <form style={{display:'flex', flexDirection:'row'}}>
                <div style={{display:'flex', flexDirection:'column'}}>
                    <AlbumCoverInput
                        onClick={() => document.getElementById('coverImage').click()}
                        image={coverImage}
                    >
                        {!coverImage && <span>Upload<br />Cover Image</span>}
                    </AlbumCoverInput>
                    <input 
                        style={{ display: 'none' }}
                        id="coverImage"
                        type="file" 
                        accept="image/*" 
                        onChange={handleCoverChange}
                    />
                    <input 
                        type="text"
                        placeholder="Write a catchy title for the content"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                    />
                    <input 
                        type="text"
                        placeholder="What describes this track"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                    />
                    <select 
                        name="visibility"
                        value={formData.visibility}
                        onChange={handleInputChange}
                    >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                    </select>
                </div>
                <div style={{display:'flex', flexDirection:'column'}}>
                <select 
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                >
                    <option value="Music video">Music video</option>
                    <option value="Integration support">Integration support</option>
                    <option value="Live in the studio">Live in the studio</option>
                    <option value="Spoken words">Spoken word</option>
                    <option value="Meditation music">Meditation music</option>
                    <option value="Behind the scenes">Behind the scenes</option>
                    <option value="Concert">Concert</option>
                </select>
                <select 
                    name="Album"
                    value={formData.Album}
                    onChange={handleInputChange}
                >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                </select>
                <input 
                    type="text"
                    placeholder="Tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                />
                </div>
            </form>
        </div>
    );
};

export default UploadDetailsForm;

const AlbumCoverInput = styled.div`
    width: 65%;
    height: 170px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${props => props.image ? 'transparent' : '#f0f0f0'};
    background-image: url(${props => props.image});
    background-size: contain; /* or 'cover' */
    background-repeat: no-repeat;
    background-position: center;
    cursor: pointer;
    display: flex;           // Use flexbox for alignment
    justify-content: center; // Center content horizontally
    align-items: center;     // Center content vertically
    margin-bottom: 3vh;

    span {
        text-align: center;  // Center text horizontally within the span
    }
`;