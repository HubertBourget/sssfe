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

const ModifySingleTrackComponent = () => { 
    const { videoId } = useParams();
    const { user, isAuthenticated } = useAuth0();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Music video',
        tags: '',
        visibility: '',
    });
    const [formError, setFormError] = useState('');
    const [videoURL, setVideoURL] = useState('');
    const [videoUrlRetrived, setVideoUrlRetrived] = useState(false);
    const [uploadedImageThumbnail, setUploadedImageThumbnail] = useState('');
    const [selectedImageSource, setSelectedImageSource] = useState("previewImage");

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
                // Set the form data with the fetched content data
                setFormData({
                    title: contentData.title || '', // Populate with existing title or an empty string if not found
                    description: contentData.description || '', // Populate with existing description or an empty string if not found
                    category: contentData.category || 'Music video', // Set default category or use existing if found
                    tags: contentData.tags || '',
                    visibility: contentData.visibility || 'Public',
                });
                // Set other state variables as needed...
            } catch (error) {
                console.error(error);
                setVideoUrlRetrived(false);
            }
        };
        fetchContentData(); // Call the fetchContentData function when the component mounts
    }, [videoId]); // Make sure to include videoId in the dependency array


const uploadImageThumbnail = () => {
    if (uploadedImageThumbnail == null) {
        console.log("uploadedImageThumbnail was null");
        return Promise.resolve(null);
    }
    const fileUploadName = v4();
    const fileRef = ref(storage, `thumbnails/${user.name}/${fileUploadName}`);
    return uploadBytes(fileRef, uploadedImageThumbnail)
        .then(() => getDownloadURL(fileRef))
        .then((url) => {
        alert("uploadedImageThumbnail Upload Successful!");
        setUploadedImageThumbnail(null);
        return url;
        })
        .catch((error) => {
        console.error(error);
        return null;
        });
};

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevState) => ({
        ...prevState,
        [name]: value
        }));
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
            <div style={{display:'flex',flexDirection:'row'}}>
                <LeftDiv>
                <CustomForm onSubmit={handleSubmit}>
                <CustomLabel>Title</CustomLabel>
                <CustomInput placeholder="Write a catchy title for the content" id="title" name="title" value={formData.title} onChange={handleInputChange} required ></CustomInput>
                <CustomLabel>Description</CustomLabel>
                <DescriptionTextArea placeholder='What describes this track' id="description" name="description" value={formData.description} onChange={handleInputChange} required />


                {/* <div>
                    Temporarly disabling this file input
                    <input id='SelectedImageThumbnail'type="file" onChange={handleImageThumbnailChange} style={{marginBottom:"3%"}}/>
                </div> */}

                {formError && <p style={{ color: 'red' }}>{formError}</p>}
                </CustomForm>
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
                        <TagComponent id="tags" onTagsChange={(tags) => handleInputChange(tags)} value={formData.tags} />
                </RightDiv>
            </div>
            
            <div>
                <DefaultButton style={{marginLeft:'3vw'}} type="submit">
                    Save
                </DefaultButton>
                {formError && <p style={{ color: 'red' }}>{formError}</p>}
            </div>
        </MainDiv>
        </>
    );
};

export default ModifySingleTrackComponent;


const MainDiv = styled.div`
    display: flex;
    flex-direction: column;
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
`;

const CustomForm = styled.form`
    width: 80%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

const CustomInput = styled.input`
    padding: 22px;
    width: 100%;
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
    width: 100%;
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
    width: 105%;
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