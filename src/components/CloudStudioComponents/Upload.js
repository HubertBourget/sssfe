import React, { useState, useEffect } from 'react';
import { ref, uploadBytesResumable, getDownloadURL, uploadBytes } from 'firebase/storage';
import { v4 } from 'uuid';
import { storage } from '../../firebase';
import styled from 'styled-components';
import FileProgressBar from './FileProgressBar';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import UploadDetailsForm from './UploadsDetailsForm';
import Rectangle27 from '../../assets/Rectangle27.png'

const Upload = ({ 
    viewState, 
    onStateChange, 
    albumTitle, 
    albumDescription, 
    visibility, 
    onAlbumDataChange,
    albumId,
    publishClicked, 
    handlePublishHandled,
    onAllUpdatesComplete
    }) => {

    const user = { name: "debug7e@debug.com" };
    //Upload tracking:
    const [fileUploadsArray, setFileUploadsArray] = useState([]);
    const [uploadProgress, setUploadProgress] = useState({});
    const [fileUploadStatus, setFileUploadStatus] = useState({});
    const [isUpdating, setIsUpdating] = useState(false);

    //Drag and drop for the upload:
    const handleDragOver = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        setFileUploadsArray(files);
    };
    const handleDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        setFileUploadsArray(files);
        if (files.length > 0) {
            onStateChange("albumCreation");
        }
    };
    //Checkbox:
    const [createAlbum, setCreateAlbum] = useState(true);
    const handleCheckboxChange = (e) => {setCreateAlbum(e.target.checked);};
    //Album creation :
    const [albumCover, setAlbumCover] = useState(null);
    // Update functions that are called when input fields are changed
    const handleDescriptionChange = (e) => {
        //passing info to the parent component where we track usestate
        onAlbumDataChange("description", e.target.value);
    };
    const handleVisibilityChange = (e) => {
        //passing info to the parent component where we track usestate
        onAlbumDataChange("visibility", e.target.value);
    };
    const handleTitleChange = (e) => {
        //passing info to the parent component where we track usestate
        onAlbumDataChange("albumTitle", e.target.value);
    };
    const handleAlbumCoverChange = (event) => {
        if (event.target.files[0]) {
            setAlbumCover(event.target.files[0]);
            uploadAlbumPicture(event.target.files[0])
        }
    };
    //Inside Album creation : Drag and Drop (rearrange menu for the order of tracks on the album):
    const onDragEnd = (result) => {
        if (!result.destination) {return;}
        const reorderedFiles = Array.from(fileUploadsArray);
        const [reorderedItem] = reorderedFiles.splice(result.source.index, 1);
        reorderedFiles.splice(result.destination.index, 0, reorderedItem);
        setFileUploadsArray(reorderedFiles);
        console.log("Rearranged array:", reorderedFiles.map(file => file.data.name));
    };
    
    //uploadDetailsForm handle changes in uploads details
    const handleDetailChange = (index, key, value) => {
        setFileUploadsArray(prevArray => {
            const newArray = [...prevArray];
            const updatedFile = { ...newArray[index], [key]: value };
            newArray[index] = updatedFile;
            return newArray;
        });
    };

    // Function to handle image file selection
    const handleImageChange = (event, index) => {
        const file = event.target.files[0];
        handleDetailChange(index, "imageFile", file);
    };

    // Function to handle form submission for each file
    const handleSubmit = (index, event) => {
        event.preventDefault();
        // Process the submission for the file at the given index
        // For example, you might want to upload the file details to a server
        const fileDetails = fileUploadsArray[index];
        console.log('Submitting details for file:', fileDetails);
    };

    //set the viewstate based on the properties of the upload event 
const handleFileChange = (event) => {
        const files = Array.from(event.target.files).map(file => ({
            data: file,
            uploaded: false,
        }));
        setFileUploadsArray(files);

        if (files.length > 1 && createAlbum) {
            postNewAlbum(albumId);
            onStateChange("albumCreation");
        } else if (files.length > 0) {
            onStateChange("fileDetail");
        }
        event.target.value = '';
    };

    //Da upload useEffect:
    useEffect(() => {
    fileUploadsArray.forEach((fileObj, index) => {
        if (!fileObj.data || fileUploadStatus[fileObj.data.name]) return;

        setFileUploadStatus(prevStatus => ({
            ...prevStatus,
            [fileObj.data.name]: { uploading: true }
        }));

        const isOnlyAudio = fileObj.data.type.startsWith('audio/');
        const fileUploadName = v4();
        console.log(fileUploadName)
        const fileRef = ref(storage, `Uploads/${user.name.toString()}/${fileUploadName}`);
        const metadata = { contentType: fileObj.data.type };
        const uploadTask = uploadBytesResumable(fileRef, fileObj.data, metadata);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(prevProgress => ({
                    ...prevProgress,
                    [fileObj.data.name]: progress,
                }));
            },
            (error) => {
                // Error handling here
                console.error('Upload error:', error);
            },
            () => {
                getDownloadURL(fileRef).then((fileUrl) => {
                    console.log('File URL:', fileUrl); // Confirming we get the file URL
                    return postContentMetaData(fileUploadName, fileUrl, isOnlyAudio);
                })
                .then(videoId => {
                    console.log("Posting Meta Data, Video ID:", videoId);
                    // Update fileUploadsArray with videoId
                    setFileUploadsArray(prevArray => {
                        const newArray = [...prevArray];
                        const updatedFile = { ...newArray[index], videoId: videoId };
                        newArray[index] = updatedFile;
                        return newArray;
                    });
                })
                .catch(error => {
                    console.error('Error in getDownloadURL or postContentMetaData:', error);
                })
                .finally(() => {
                    setFileUploadStatus(prevStatus => ({
                        ...prevStatus,
                        [fileObj.data.name]: { uploading: false, completed: true }
                    }));
                });
            }
        );
    }
    );
}, [fileUploadsArray, user.name]);

//debugging
useEffect(() => {
    console.log("Publish Clicked Status:", publishClicked);
}, [publishClicked]);

    useEffect(() => {
    if (publishClicked) {
        handleUpdateReviewStatus();
    }
    }, [publishClicked]);
    
const handleUpdateReviewStatus = async () => {
    setIsUpdating(true);
    const fileIds = fileUploadsArray.map(file => file.videoId); // Assuming 'videoId' is the unique identifier

    console.log("Starting the update process for review status.");

    try {
        // Send a batch request or individual requests to update MongoDB
        const promises = fileIds.map(videoId => {
            console.log(`Updating review status for file ID: ${videoId}`);
            return fetch(`${process.env.REACT_APP_API_BASE_URL}/api/updateReviewStatus`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ videoId, b_isPreparedForReview: true }),
            }).then(response => {
                console.log(`Response received for file ID: ${videoId}`);
                return response.json();
            }).then(result => {
                console.log(`Update result for file ID ${videoId}:`, result);
            });
        });

    await Promise.all(promises);
    console.log("Review status updated for all files.");
    setIsUpdating(false);
    onAllUpdatesComplete();
    handlePublishHandled(); // Reset publishClicked to false
    } catch (error) {
        console.error('Error updating review status:', error);
    }
};

    //Api calls:
    const postContentMetaData = async (videoId, fileUrl, isOnlyAudio) => {
        console.log('inside the function - postContentMetaData:', videoId, fileUrl, isOnlyAudio);
        const timestamp = new Date().toISOString();
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/postContentMetaData`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    owner: user.name.toString(),
                    videoId: videoId,
                    timestamp: timestamp,
                    fileUrl: fileUrl,
                    b_isPreparedForReview: false,
                    b_hasBeenReviewed: false,
                    b_isApproved: false,
                    isOnlyAudio: isOnlyAudio,
                }),
            });
            return videoId; // Assuming the response contains the videoId
        } catch (error) {
            console.error('Error posting metadata:', error);
            return null;
        }
    };


    const uploadAlbumPicture = (uploadingPicture) => {
        if (uploadingPicture == null) {
            console.log("profilePicture was null");
            return;
        }
        const fileUploadName = v4();
        const fileRef = ref(storage, `AlbumPictures/${user.name}/${fileUploadName}`);
        const metadata = {
            contentType: 'image/jpeg',
        };
        uploadBytes(fileRef, uploadingPicture, metadata)
            .then(() => {
            getDownloadURL(fileRef)
                .then((url) => {
                postAlbumImage(url);
                setAlbumCover(url); // Update the profilePicture state with the new URL
                })
                .catch((error) => {
                console.error(error);
                });
            })
            .catch((error) => {
            console.error(error);
            });
    };

    const postAlbumImage = (url) => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/postAlbumImage`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            albumId: albumId,
            albumImageUrl: url,
        }),
        })
        .then((res) => res.json())
        .then((data) => console.log(data));
    };

    const postNewAlbum = (albumId) => {
        console.log('postNewAlbum: id:', albumId)
        const timestamp = new Date().toISOString();
        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/postNewAlbum`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                owner: user.name.toString(),
                albumId: albumId,
                timestamp: timestamp,
            }),
        })
        .then((res) => res.json())
        .catch((error) => console.error('Error posting metadata:', error));
    };

    return (
        <>
        {viewState === "initial" && (
                <DropZone onDragOver={handleDragOver} onDrop={handleDrop}>
                        <h1 style={{ marginTop: '5vh' }}>Drop your music here: single tracks or whole albums.</h1>
                        <UploadStyledLabel>
                            <h3 style={{ color: "#F5F5F5", lineHeight: "0", padding: "5px" }}>or choose files to upload</h3>
                            <input type="file" accept="video/*, audio/*" onChange={handleFileChange} multiple />
                        </UploadStyledLabel>
                        <label>
                            <input 
                                type="checkbox" 
                                checked={createAlbum} 
                                onChange={handleCheckboxChange} 
                            />
                            Create an Album Instantly with Multiple Selection
                        </label>
                </DropZone>
        )}


        {viewState === "albumCreation" && (
            <AlbumCreationView>
                <AlbumDetails>
                    <h1>Album Details</h1>
                    <input
                        type="text"
                        placeholder="Title"
                        value={albumTitle}
                        onChange={handleTitleChange}
                    />
                    <h3>Upload Album Cover</h3>
                        {albumCover && <img src={albumCover} alt="Album Cover" style={{ width: '100px', height: '100px' }} />}
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => {
                                handleAlbumCoverChange(e);
                            }}
                    />
                    <input
                    type="text"
                    placeholder="Description"
                    value={albumDescription}
                    onChange={handleDescriptionChange}
                    />
                    <select value={visibility} onChange={handleVisibilityChange}>
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                    </select>
                </AlbumDetails>
                <FileUploads>
                    <h2>Tracks from this album</h2>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="fileUploads">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                    {fileUploadsArray.map((file, index) => (
                                        <Draggable key={`${file.data.name}-${index}`} draggableId={`${file.data.name}-${index}`} index={index}>
                                            {(provided) => (
                                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                    <FileProgressBar file={file.data} progress={uploadProgress[file.data.name] || 0} />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </FileUploads>


            </AlbumCreationView>
        )}

        {viewState === "fileDetail" && (
        <div>
            {fileUploadsArray.map((file, index) => (
                <UploadDetailsForm 
                    key={index}
                    file={file}
                    index={index}
                    videoId={file.videoId}
                    handleDetailChange={handleDetailChange}
                    handleImageChange={handleImageChange}
                    handleSubmit={handleSubmit}
                    progress={uploadProgress[file.data.name] || 0}
                />
            ))}
        </div>
        )}
    </>

    );
};

export default Upload;

const DropZone = styled.div`
    align-items: center;
    padding: 20px;
    text-align: center;
    margin: 20px;
    height: 35vh;
    z-index: 12;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-top: 12vh;
    background-size: cover;      /* Cover the entire div */
    background-position: center; /* Center the image in the div */
    background-repeat: no-repeat;
    border: 10px solid transparent; // Adjust border size as needed
    border-image: url(${Rectangle27}) 30 30 round; // Adjust slicing and repeat as needed
    &::before, &::after {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        height: 10px; // Adjust based on sprite size
        background: url(${Rectangle27}) repeat-x;
    }

    &::before {
        top: -10px; // Adjust based on sprite size
    }

    &::after {
        bottom: -10px; // Adjust based on sprite size
    }
`;

const UploadStyledLabel = styled.label`
    display: inline-block;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    background-color: #434289;
    border-radius: 33px;
    margin-top: 15px;
    padding: 11px;
    color:white;
    margin-bottom: 11px;
    z-index: 11;
& input[type="file"] {
    position: absolute;
    font-size: 100px;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 0;
    cursor: pointer;
    display: none;
}
`;

const CheckBoxWrapper = styled.div`
    position: absolute;
    bottom: 15px;
    left: 33px; // Position the checkbox 10px from the left edge
    text-align: left;
    display: flex;
    align-items: center;
    z-index: 11;
`;

const AlbumCreationView = styled.div`
    display: flex;
`;

const AlbumDetails = styled.div`
    flex: 1 1 0%;
    display: flex;
    flex-direction: column;
`;

const FileUploads = styled.div`
    flex: 1;
`;
