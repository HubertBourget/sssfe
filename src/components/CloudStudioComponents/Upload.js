import React from 'react';
import { useState, useEffect } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';
import { storage } from '../../firebase';

const Upload = ({ user }) => {
    const [isOnlyAudio, setIsOnlyAudio] = useState('');
    const [fileUpload, setFileUpload] = useState(null);
    useEffect(() => {
    if (fileUpload !== null) {
    uploadFile();
    }
    }, [fileUpload]);

    const handleFileChange = (event) => {
    const files = event.target.files;
    if (fileUpload) {
        // File is already selected, handle the error or display a message
        console.error('A file is already selected. Clear the selection first.');
        return;
    }

    const latestFile = files[files.length - 1];
    setIsOnlyAudio(event.target.accept.includes('audio'));
    setFileUpload(latestFile);
    event.target.value = ''; // clear the input field
};

const uploadFile = () => {
    if (fileUpload == null) {
        return;
    }
    const fileUploadName = v4();
    const fileRef = ref(storage, `Uploads/${user.name}/${fileUploadName}`);
    const uploadTask = uploadBytesResumable(fileRef, fileUpload);

    // setIsUploading(true);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on('state_changed',
        (snapshot) => {
            // Calculate the upload percentage
            // const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            // setUploadProgress(progress);
        },
        (error) => {
            console.error('Upload error:', error);
            // Handle the error here if needed
        },
        () => {
            // Upload completed successfully
            getDownloadURL(fileRef).then((fileUrl) => {
                const videoId = fileUploadName;
                // postGenerateThumbnailImage(fileUrl, videoId);
                postContentMetaData(videoId, fileUrl);
                // setUploadProgress(100); // Set progress to 100% when completed
                setFileUpload(null); // Clear the selected file after successful upload
            });
        }
    );
    const postContentMetaData = (videoId, fileUrl) => {
        const timestamp = new Date().toISOString();
        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/postContentMetaData`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({
            videoOwner: user.name,
            videoId: videoId,
            timestamp: timestamp,
            fileUrl: fileUrl,
            isOnlyAudio: isOnlyAudio,
            b_isPreparedForReview: false,
            b_hasBeenReviewed: false,
            b_isApproved: false,
        }),
        })
        .then((res) => res.json())
    };

};

    return (
        <div>
            Upload
            <input
                    type="file"
                    accept={`video/*`}
                    onChange={handleFileChange}
                  />
        </div>
    )
}

export default Upload;