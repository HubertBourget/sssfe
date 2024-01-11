import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import FileProgressBar from './FileProgressBar';
import { v4 } from 'uuid';
import { storage } from '../../firebase';
import { ref } from 'firebase/storage';
import { getDownloadURL, uploadBytes } from 'firebase/storage';

const UploadDetailsForm = ({ file, index, handleDetailChange, handleImageChange, handleSubmit, progress, videoId }) => {
    //three of those now:
    const user = { name: "debug7e@debug.com" };

    const [formData, setFormData] = useState({
        title: file.title || '',
        description: file.description || '',
        tags: file.tags || '',
        category: file.category || '',
        visibility: file.visibility || 'public',
        selectedImageThumbnail: file.selectedImageThumbnail || '',
    });
    const [displayedImage, setDisplayedImage] = useState(null);


    const debouncedUpdate = debounce(async (data) => {
    try {
        if(!videoId) return;
        console.log('Sending data:', { videoId, ...data });  // Log the data being sent
        const response = await axios.post('https://monkfish-app-nb3ck.ondigitalocean.app/api/updatePartialContentMetaData', {
            videoId: videoId,
            ...data
        });
        console.log('Response:', response.data);
    } catch (error) {
        console.error('Error updating data:', error);
    }
}, 3000);


const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => {
        const updatedFormData = { ...prevFormData, [name]: value };
        debouncedUpdate(updatedFormData);  // Call debouncedUpdate here
        return updatedFormData;
    });
};

const handleImageThumbnailChange = async (event) => {
    if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        const uploadedImageUrl = await uploadImageThumbnail(file);
        if (uploadedImageUrl) {
            setFormData(prevFormData => {
                const updatedFormData = { ...prevFormData, selectedImageThumbnail: uploadedImageUrl };
                debouncedUpdate(updatedFormData); // Call debouncedUpdate here
                return updatedFormData;
            });
        }
    }
};

useEffect(() => {
        debouncedUpdate(formData);
        return () => debouncedUpdate.cancel();
    }, [formData]);

async function uploadImageThumbnail(file) {
    if (file == null) {
        console.log("ImageThumbnail was null");
        return null;
    }
    const fileUploadName = v4();
    const fileRef = ref(storage, `thumbnails/${user.name}/${fileUploadName}`);
    const metadata = {
        contentType: 'image/jpeg',
    };

    try {
        await uploadBytes(fileRef, file, metadata);
        const url = await getDownloadURL(fileRef);
        setDisplayedImage(url); // Optional: Update the displayed image
        return url; // Return the URL of the uploaded image
    } catch (error) {
        console.error(error);
        return null; // Return null in case of error
    }
}


    return (
        <div>
            <FileProgressBar file={file.data} progress={progress} />
            <form>
                <div>videoId:{videoId}</div>
                <input 
                    type="text"
                    placeholder="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                />
                <input 
                    type="text"
                    placeholder="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                />
                <input 
                    type="text"
                    placeholder="Tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                />
                <input 
                    type="text"
                    placeholder="Category"
                    name="category"
                    value={formData.category}
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
                <input 
                    type="file"
                    accept="image/*"
                    onChange={handleImageThumbnailChange}
                />
                {displayedImage && <img src={displayedImage} alt="Image thumbnail Preview" />}
            </form>
        </div>
    );
};

export default UploadDetailsForm;