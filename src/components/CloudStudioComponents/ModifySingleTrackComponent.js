import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import styled from 'styled-components';
import { GlobalStyle } from '../GlobalStyle';
import { v4 } from 'uuid';
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import TagComponent from '../CloudStudioComponents/NewTagComponent';
import uploadHamburgerIcon from '../../assets/uploadHamburgerIcon.png';
import uploadTrashIcon from '../../assets/uploadTrashIcon.png';

const ModifySingleTrackComponent = () => { 
    const { user, isAuthenticated } = useAuth0();
    // const user = { name: "debug9@debug.com" };
    // const isAuthenticated = true;

    const { videoId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Music video',
        tags: [],
        visibility: '',
    });
    const [formError, setFormError] = useState('');
    const [videoURL, setVideoURL] = useState('');//Disabled to match design
    const [videoUrlRetrived, setVideoUrlRetrived] = useState(false);//Disabled to match design
    const [uploadedImageThumbnail, setUploadedImageThumbnail] = useState('');
    const [selectedImageSource, setSelectedImageSource] = useState("previewImage");
    const [uploadedThumbnailUrl, setUploadedThumbnailUrl] = useState('');// Necessary for passing the url of the Track's image to MongoDB


    useEffect(() => {
        const fetchVideosURL = async () => {
            try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_BASE_URL}/api/getContentById`,
                {
                params: {
                    videoId: videoId,
                },
                }
            );
            console.log("getContentById - response.data: ",response.data);
            setVideoURL(response.data.contentDocument.fileUrl);
            setVideoUrlRetrived(true);

            } catch (error) {
            console.error(error);
            setVideoUrlRetrived(false);
            }
        };
        fetchVideosURL();
    }, []);

    useEffect(() => {
        const fetchContentData = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_BASE_URL}/api/getContentById`,
                    {
                        params: {
                            videoId: videoId,
                        },
                    }
                );
                const contentData = response.data.contentDocument;
                // Assuming tags are a comma-separated string and TagComponent expects an array
                const tagsArray = contentData.tags ? contentData.tags.split(',') : [];
                // Set the form data with the fetched content data
                setFormData({
                    title: contentData.title || '',
                    description: contentData.description || '',
                    category: contentData.category || 'Music video',
                    tags: tagsArray, // Convert to array if necessary
                    visibility: contentData.visibility || 'Public',
                });

                // Set uploaded image thumbnail if coverImageUrl exists
                if (contentData.coverImageUrl) {
                    setUploadedImageThumbnail(contentData.coverImageUrl);
                }

            } catch (error) {
                console.error(error);
            }
        };
        fetchContentData(); // Call the fetchContentData function when the component mounts
    }, [videoId]);


    const handleCloseClick = () => {
        navigate('/studio')
    };

    const handleDelete = () => {
        axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/deleteContent`, {
        params: { videoId },
        headers: {
            'user-id': user.name // Setting the custom header for user ID
        }
    })
    .then(response => {
        navigate('/studio')
    })
    .catch(error => {
        console.error('Error:', error);
    });
        }

    const uploadImageThumbnail = async (file) => {
        if (!file) {
            console.log("No file provided for upload.");
            return;
        }
        const fileUploadName = v4();
        const fileRef = ref(storage, `thumbnails/${user.name}/${fileUploadName}`);

        try {
            await uploadBytes(fileRef, file, { contentType: file.type });
            const url = await getDownloadURL(fileRef);

            // Update MongoDB with the new image URL
            await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/updateTrackThumbnail`, {
                videoId: videoId,
                thumbnailUrl: url,
            });

            alert("Image Upload and Update Successful!");
            setUploadedThumbnailUrl(url); // Update state if needed
        } catch (error) {
            console.error("Error in image upload: ", error);
        }
    };




    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevState) => ({
        ...prevState,
        [name]: value
        }));
    };

    const dragOverHandler = (event) => {
    // Prevent the browser's default behavior when dragging over
    event.preventDefault();
};

    const fileChangeHandler = (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log("Selected file type:", file.type); // Log the file type
            setUploadedImageThumbnail(file);
            uploadImageThumbnail(file); // Pass the file directly
        }
    };

    const dropHandler = (event) => {
        // Prevent the browser from opening the file
        event.preventDefault();

        let file;
        if (event.dataTransfer.items) {
            // Use DataTransferItemList to get the file
            if (event.dataTransfer.items[0].kind === 'file') {
                file = event.dataTransfer.items[0].getAsFile();
            }
        } else {
            // Use DataTransfer to get the file
            file = event.dataTransfer.files[0];
        }

        // Check if a file is actually selected
        if (file && file.type.match('image.*')) {
            setUploadedImageThumbnail(file); // Update your state with the new file
            uploadImageThumbnail(file); // Pass the file directly
            console.log('Profile image dropped:', file.name);
        } else {
            console.log('File is not an image:', file.name);
        }

        // Clear the drag data cache
        if (event.dataTransfer.items) {
            event.dataTransfer.items.clear();
        } else {
            event.dataTransfer.clearData();
        }
    };

    const handleTagsChange = (newTags) => {
        setFormData({ ...formData, tags: newTags });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/updateContentMetaData`, {
                videoId: videoId,
                b_isPreparedForReview: true,
                title: formData.title,
                description: formData.description,
                category: formData.category,
                tags: formData.tags,
                // The image URL is already updated separately
            });
            console.log('ContentMetaData updated successfully');
            navigate('/studio');
        } catch (error) {
            setFormError('An error occurred while updating the ContentMetaData');
            console.error(error);
        }
    };

    //Disabling for testing:
    //Conditionnal rendering to make sure the user is authenticated.
    // if (!isAuthenticated) {
    //     return (
    //     <div style={{display:"flex", flexDirection:'column', width:'30%', alignItems:'center'}}>
    //         <p>Please log in to access the Cloud Studio.</p>
    //     </div>
    //     );
    // }

    return (
        <>
        <GlobalStyle/>
        <MainDiv>
            <CustomForm onSubmit={handleSubmit}>
            <Header>
                <CloseButton onClick={handleCloseClick}>
                    Close
                </CloseButton>  
                <button style={{display:'flex', flexDirection:'row-reverse', marginRight:'5vw'}} type="submit">
                    Publish
                </button>
            </Header>
            <h1 style={{marginLeft:'3vw'}}>Edit Track</h1>
            {/* <TrackHeaderDiv>
                <FullBlueLine/>
                <img src={uploadHamburgerIcon} alt="" />
                <FileName>{formData.title}</FileName>
                <img src={uploadTrashIcon} alt="" style={{cursor:'pointer'}} onClick={handleDelete} />
            </TrackHeaderDiv> */}
            <div style={{display:'flex',flexDirection:'row', justifyContent:'space-between'}}>
                <LeftDiv>
                <UploadProfileImageContainer 
                    onClick={() => document.getElementById('file-input').click()}
                    onDrop={dropHandler}
                    onDragOver={dragOverHandler}
                >
                    {uploadedImageThumbnail ? (
                        <>
                            <img src={uploadedImageThumbnail} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <p>Change cover image</p>
                        </>
                    ) : (
                        <p>Upload cover image</p>
                    )}
                    <input type="file" accept="image/*" id="file-input" hidden onChange={fileChangeHandler} />
                </UploadProfileImageContainer>
                
                <CustomLabel>Title</CustomLabel>
                <CustomInput placeholder="Write a catchy title for the content" id="title" name="title" value={formData.title} onChange={handleInputChange} required ></CustomInput>
                <CustomLabel>Description</CustomLabel>
                <DescriptionTextArea placeholder='What describes this track' id="description" name="description" value={formData.description} onChange={handleInputChange} required />
                {/* <div>
                    Temporarly disabling this file input
                    <input id='SelectedImageThumbnail'type="file" onChange={handleImageThumbnailChange} style={{marginBottom:"3%"}}/>
                </div> */}
                </LeftDiv>
                <RightDiv>
                    <CustomLabel>Category</CustomLabel>
                        <CustomSelect id="category" name="category" value={formData.category} onChange={handleInputChange}>
                            <option value="Music video">Music video</option>
                            <option value="Integration support">Integration support</option>
                            <option value="Live in the studio">Live in the studio</option>
                            <option value="Spoken words">Spoken word</option>
                            <option value="Meditation music">Meditation music</option>
                            <option value="Behind the scenes">Behind the scenes</option>
                            <option value="Concert">Concert</option>
                        </CustomSelect>
                        <TagComponent style={{width:"90%"}} id="tags" onTagsChange={handleTagsChange} value={formData.tags} />
                </RightDiv>
            </div>
            
            <div>
                {formError && <p style={{ color: 'red' }}>{formError}</p>}
            </div>
            </CustomForm>
        </MainDiv>
        </>
    );
};

export default ModifySingleTrackComponent;


const MainDiv = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const LeftDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: start;
    width: 45%;
    margin-left: 3%;
    z-index: 2;
`;

const RightDiv = styled.div`
    width: 45%;
    margin-right: 3%;
`;

const CustomForm = styled.form`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

const CustomInput = styled.input`
    padding: 22px;
    width: 90%;
    margin-top: 2%;
    border: 2px solid #D9D9D9;
    :focus {
            outline: none;
            border: 2px solid #434289;
        }
`;

const CustomLabel = styled.label`
    margin-top: 3%;
`;

const DescriptionTextArea = styled.textarea`
    width: 90%;
    height: 70px;
    padding: 22px;
    resize: none;
    border: 2px solid #D9D9D9;
        color: #434289;
        :focus {
            outline: none;
            border: 2px solid #434289;
        }
`;

const CustomSelect = styled.select`
    padding: 22px;
    width: 90%;
    margin-top: 2%;
    margin-bottom: 5%; //Adjustement for disabling ImageThumbnails
    border: 2px solid #D9D9D9;
    :focus {
            outline: none;
            border: 2px solid #434289;
        }
`;

const DefaultButton = styled.button`
    color: white;
    border: none;
    background-color: #434289;
    border-radius: 33px;
    padding: 7px 60px;
    margin-top: 3%;
`;

const UploadProfileImageContainer = styled.div`
    height: 200px;
    width: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    cursor: pointer;

:hover {
    background-color: lightblue;
}
`
const Header = styled.div`
    width: 100%;
    height: 12vh;
    box-shadow: rgb(0 0 0 / 30%) 0px 4px 4px -2px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const CloseButton = styled.button`
    background-color: rgb(0, 0, 0, 0);
    border: none;
    cursor: pointer;
    border-radius: 5px;
    font-size: 20px;
    color: rgb(67, 66, 137);
    text-decoration: underline;
    margin-left: 4vw;
`;

const TrackHeaderDiv = styled.div`
    margin-top: 10px;
    position: relative;
    background-color: rgb(245, 245, 245);
    padding: 22px;
    border: 1px solid rgb(217, 217, 217);
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    width: 100vh;
`;

const FullBlueLine = styled.div`
    background-color: rgb(67, 66, 137);
    width: 100%;
    height: 6px;
    transition: width 0.4s ease 0s;
    position: absolute;
    top: 0px;
    left: 0px;
`;

const FileName = styled.span`
    position: absolute; // Normal flow, below the progress bar
    color: #333; // Text color, change as needed
    font-size: 20px; // Adjust as per your design
    display: flex;
    justify-content: center;
    left: 45%;
`;