import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import styled from 'styled-components';
import { GlobalStyle } from '../components/GlobalStyle';
import { v4 } from 'uuid';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import LoginButton from '../components/LoginButton';

const PrepareForQA = () => {
    const { videoId } = useParams();
    const { user, isAuthenticated } = useAuth0();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Music video'
    });
    const [formError, setFormError] = useState('');
    const [videoURL, setVideoURL] = useState('');
    const [videoUrlRetrived, setVideoUrlRetrived] = useState(false);
    const [imageThumbnail0, setImageThumbnail0] = useState('');
    const [imageThumbnail1, setImageThumbnail1] = useState('');
    const [imageThumbnail2, setImageThumbnail2] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [uploadedImageThumbnail, setUploadedImageThumbnail] = useState('');
    const [previewImageThumbnail, setPreviewImageThumbnail] = useState(null);


useEffect(() => {
    const fetchVideosURL = async () => {
        try {
        const response = await axios.get(
            'https://jellyfish-app-tj9ha.ondigitalocean.app/api/getContentById',
            {
            params: {
                videoId: videoId,
            },
            }
        );
        setVideoURL(response.data.contentDocument.fileUrl);
        setVideoUrlRetrived(true);
        setImageThumbnail0(response.data.contentDocument.ImageThumbnailURL0);
        setImageThumbnail1(response.data.contentDocument.ImageThumbnailURL1);
        setImageThumbnail2(response.data.contentDocument.ImageThumbnailURL2);

        } catch (error) {
        console.error(error);
        setVideoUrlRetrived(false);
        }
    };
    fetchVideosURL();
}, []);

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


        const handleImageThumbnailChange = (event) => {
        const files = event.target.files;
        const latestFile = files[files.length - 1]; //always select the last file uploaded in the array.
        setUploadedImageThumbnail(latestFile);
        setPreviewImageThumbnail(URL.createObjectURL(latestFile));
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
        if(selectedImage == null){ 
            alert("please select an imageThumbnail");
            return;
        }
        let imageThumbnailURL = selectedImage;
        if (selectedImageIndex === 0) {
            imageThumbnailURL = await uploadImageThumbnail();
        }
        try {
        await axios.post('https://jellyfish-app-tj9ha.ondigitalocean.app/api/updateContentMetaData', {
            videoId: videoId,
            b_isPreparedForReview: true,
            title: formData.title,
            description: formData.description,
            category: formData.category,
            selectedImageThumbnail: imageThumbnailURL
        });
        console.log('ContentMetaData updated successfully');
        navigate('/studio');
        } catch (error) {
        setFormError('An error occurred while updating the ContentMetaData');
        console.error(error);
        }
    };


    const handleImageClick = (image, index) => {
        setSelectedImage(image);
        setSelectedImageIndex(index);
        console.log(index);
        console.log(selectedImage);
    };

    //Conditionnal rendering to make sure the user is authenticated.
    if (!isAuthenticated) {
        return (
        <div style={{display:"flex", flexDirection:'column', width:'30%', alignItems:'center'}}>
            <p>Please log in to access the Cloud Studio.</p>
            <LoginButton></LoginButton>
        </div>
        );
    }

    return (
        <>
        <GlobalStyle/>
        <MainDiv>
            <LeftDiv>
                <div style={{display:"flex", flexDirection:"row"}}>
                    <HeaderDiv>
                        <h1>Add Metadata to get discovered easily.</h1>
                        <h3>Allow the sacred sound recommendation engine to expand your reach.</h3>
                    </HeaderDiv>
                </div>
                <CustomForm onSubmit={handleSubmit}>
                <CustomLabel><h3>Write a catchy title for the content.</h3></CustomLabel>
                <CustomInput id="title" name="title" value={formData.title} onChange={handleInputChange} required ></CustomInput>
                <CustomLabel><h3>Add a video description including #hashtags.</h3></CustomLabel>
                    <DescriptionTextArea id="description" name="description" value={formData.description} onChange={handleInputChange} required />
                <CustomLabel><h3>Select the content's category.</h3></CustomLabel>
                <CustomSelect id="category" name="category" value={formData.category} onChange={handleInputChange}>
                    <option value="Music video">Music video</option>
                    <option value="Integration support">Integration support</option>
                    <option value="Live in the studio">Live in the studio</option>
                    <option value="Spoken words">Spoken words</option>
                    <option value="Meditation music">Meditation music</option>
                    <option value="Behind the scenes">Behind the scenes</option>
                    <option value="Concert">Concert</option>
                </CustomSelect>
                <ThumbnailContainerDiv>
                    {previewImageThumbnail && (
                    <ThumbnailImageDiv style={{border: selectedImageIndex === 0 ? "4px solid #434289" : "none",}}>
                        <ThumbnailImg
                        src={previewImageThumbnail}
                        onClick={() => handleImageClick(`${imageThumbnail2}`, 0)}
                        />
                    </ThumbnailImageDiv>
                    )}
                    <ThumbnailImageDiv style={{border: selectedImageIndex === 1 ? "4px solid #434289" : "none",}}>
                        <ThumbnailImg
                        src={imageThumbnail0}
                        onClick={() => handleImageClick(`${imageThumbnail0}`, 1)}
                        
                        />
                    </ThumbnailImageDiv>
                    <ThumbnailImageDiv style={{border: selectedImageIndex === 2 ? "4px solid #434289" : "none",}}>
                        <ThumbnailImg
                        src={imageThumbnail1}
                        onClick={() => handleImageClick(`${imageThumbnail1}`, 2)}
                        />
                    </ThumbnailImageDiv>
                    <ThumbnailImageDiv style={{border: selectedImageIndex === 3 ? "4px solid #434289" : "none",}}>
                        <ThumbnailImg
                        src={imageThumbnail2}
                        onClick={() => handleImageClick(`${imageThumbnail2}`, 3)}
                        />
                    </ThumbnailImageDiv>
                </ThumbnailContainerDiv>
                <input type="file" onChange={handleImageThumbnailChange} style={{marginBottom:"3%"}}/>
                
                {formError && <p style={{ color: 'red' }}>{formError}</p>}
                <div>
                    <DefaultButton type="submit">
                        <h2 style={{color:"#F5F5F5"}}>Save</h2>
                    </DefaultButton>
                </div>
                </CustomForm>
            </LeftDiv>
            <RightDiv>
                {videoUrlRetrived ? (
                    <div style={{marginTop:"8%"}}>
                <video controls style={{maxWidth:"90%", maxHeight:"500px"}}>
                    <source src={videoURL} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                </div>
                ) : (
                    <p>Loading...</p>
                )}
            </RightDiv>
        </MainDiv>
        </>
    );
};

export default PrepareForQA;


const MainDiv = styled.div`
    display: flex;
`;

const LeftDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: start;
    width: 55%;
    margin-left: 3%;
    z-index: 2;
`;

const HeaderDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: start;
    width: 80%;
    margin-top: 7%;
`;

const CustomForm = styled.form`
    width: 80%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

const CustomInput = styled.input`
    border-radius: 33px;
    padding: 2%;
    width: 100%;
    margin-top: 2%;
`;

const CustomLabel = styled.label`
    margin-top: 3%;
`;

const DescriptionTextArea = styled.textarea`
    border-radius: 33px;
    width: 100%;
    height: 70px;
    padding: 2%;
    resize: none;
`;

const CustomSelect = styled.select`
    border-radius: 33px;
    padding: 2%;
    width: 105%;
    margin-top: 2%;
`;

const ThumbnailContainerDiv = styled.div`
height: 222px;
margin-top: 7%;
margin-bottom: 7%;
display: flex;
`;

const ThumbnailImageDiv = styled.div`
height: 100%;
width: 333px;
margin-right: 33px;
`;

const ThumbnailImg = styled.img`
height: 100%;
width: 100%;
`;

const DefaultButton = styled.button`
    color: white;
    border: none;
    background-color: #434289;
    border-radius: 333px;
    padding: 7px 60px;
`;

const RightDiv = styled.div`
    width: 42%;
`;