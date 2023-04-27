import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import styled from 'styled-components';
import { GlobalStyle } from '../components/GlobalStyle';

const PrepareForQA = () => {
    const { videoId } = useParams();
    const { user } = useAuth0();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Music video'
    });
    const [formError, setFormError] = useState('');
    const [videoURL, setVideoURL] = useState('');
    const [videoUrlRetrived, setVideoUrlRetrived] = useState(false);

useEffect(() => {
    const fetchVideosURL = async () => {
        try {
        const response = await axios.get(
            'https://jellyfish-app-tj9ha.ondigitalocean.app/api/getVideoUrlById',
            {
            params: {
                videoId: videoId,
            },
            }
        );
        setVideoURL(response.data.fileUrl);
        setVideoUrlRetrived(true);
        } catch (error) {
        console.error(error);
        setVideoUrlRetrived(false);
        }
    };
    fetchVideosURL();
}, []);


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
        await axios.post('https://jellyfish-app-tj9ha.ondigitalocean.app/api/updateVideoMetaData', {
            videoId: videoId,
            videoOwner: user.name,
            b_isPreparedForReview: true,
            title: formData.title,
            description: formData.description,
            category: formData.category
        });
        console.log('Video metadata updated successfully');
        navigate('/studio');
        } catch (error) {
        setFormError('An error occurred while updating the video metadata');
        console.error(error);
        }
    };

    const handleClick = () => {
    console.log(videoURL);
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
                <video controls>
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
    margin-bottom: 5%;
    margin-top: 2%;
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