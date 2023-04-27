import React, { useState, useEffect } from 'react';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';
import { GlobalStyle } from '../components/GlobalStyle';
import MandalaBG from '../assets/MandalaAlpha.png';
import FaceImg from '../assets/Face.png';
import MusicIcon from '../assets/MusicIcon.png';
import CircleMandala from '../assets/CircleMandala.png';
import ProfileEditSection from '../components/ProfileEditSection';

export default function CloudStudioPage() {
    const [uploadType, setUploadType] = useState('');
    const [title, setTitle] = useState('');
    const [fileUpload, setFileUpload] = useState(null);
    const [fileList, setFileList] = useState([]);
    const { user, isAuthenticated } = useAuth0();
    const [bio, setBio] = useState('');
    const [artistLink, setArtistLink] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [accountName, setAccountName] = useState('');
    const [accountAvailableAlert, setAccountAvailableAlert] = useState('');
    const [activeComponent, setActiveComponent] = useState('component1');

    useEffect(() => {
        if (fileUpload !== null) {
        uploadFile();
        }
    }, [fileUpload]);

    useEffect(() => {
        const fetchVideos = async () => {
        if (user && user.name) {
            const response = await axios.get('https://jellyfish-app-tj9ha.ondigitalocean.app/api/getPreReviewedVideoList', {
            params: {
                videoOwner: user.name,
                b_isPreparedForReview: false,
            },
            });
            setFileList(response.data);
        }
        };
        fetchVideos();
    }, [user?.name, fileUpload]); // add fileUpload to the dependency array

        const postGenerateThumbnailImage = (video_url, video_id) => {
        fetch('https://jellyfish-app-tj9ha.ondigitalocean.app/api/createImageThumbnail', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({
            video_url: video_url,
            video_id: video_id
        }),
        })
        .then((res) => res.json())
        .then((data) => console.log("postGenerateThumbnailImage: " + data));
    };

    const handleSectionChange = (componentName) => {
    setActiveComponent(componentName);
    };


const handleFileChange = (event) => {
    const files = event.target.files;
    const latestFile = files[files.length - 1]; //always select the last file uploaded in the array.
    setFileUpload(latestFile);
    event.target.value = ''; // clear the input field
};

    const uploadFile = () => {
        if (fileUpload == null) {
        return;
        }
        const fileUploadName = v4();
        const fileRef = ref(storage, `Uploads/${user.name}/${fileUploadName}`);
        uploadBytes(fileRef, fileUpload).then(() => {
        getDownloadURL(fileRef).then((url) => {
            const videoId = fileUploadName;
            postVideoMetaData(videoId, url);
            postGenerateThumbnailImage(url, videoId);
            alert('Upload Successful!');
            setFileUpload(null); // clear the selected file after successful upload
        });
        });
    };

    const postVideoMetaData = (videoId, fileUrl) => {
        fetch('https://jellyfish-app-tj9ha.ondigitalocean.app/api/postVideoMetaData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({
            videoOwner: user.name,
            title: title,
            videoId: videoId,
            b_isPreparedForReview: false,
            b_hasBeenReviewed: false,
            b_isApproved: false,
            fileUrl: fileUrl,
        }),
        })
        .then((res) => res.json())
        .then((data) => console.log(data));
    };

    return (
    <>
    {/* {isAuthenticated ? ( */}
    <>
        <GlobalStyle/>
        <HeaderDiv>
            <h1>Cloud Studio</h1>
        </HeaderDiv>
        <UploadAndPreviewDivContainer>
            <UploadDiv backgroundImage={MandalaBG}>
            <h1 style={{marginBottom:"33px"}}>Upload your best quality content here.</h1>
                <ButtonMainContainer>
                    <UploadButtonColumnDiv>
                        <UploadStyledLabel>
                            <h1 style={{color: "#F5F5F5", lineHeight: "0", padding:"11px"}}>Upload Video</h1>
                            {uploadType.charAt(0).toUpperCase() + uploadType.slice(1)}
                            <input type="file" accept={`video/*`} onChange={handleFileChange} />
                        </UploadStyledLabel>
                        <p style={{lineHeight: "0"}}>MP4 or MOV files.</p>
                    </UploadButtonColumnDiv>
                    <UploadButtonColumnDiv>
                        <UploadStyledLabel>
                            <h1 style={{color: "#F5F5F5", lineHeight: "0", padding:"11px"}}>Upload Audio</h1>
                            {uploadType.charAt(0).toUpperCase() + uploadType.slice(1)}
                            <input type="file" accept={`audio/*`} onChange={handleFileChange} />
                        </UploadStyledLabel>
                        <p style={{lineHeight: "0"}}>WAV or MP3 files.</p>
                    </UploadButtonColumnDiv>
                    
                    
                </ButtonMainContainer>
            </UploadDiv>
            {fileList.length > 0 ? (
                <UploadedContentDivContainer>
                    {fileList.map((video) => (
                        <UploadedContentDiv key={video.VideoMetaData.videoId} backgroundImage={CircleMandala}>
                            <Link to={`/PrepareForQA/${video.VideoMetaData.videoId}`}>
                                <CenteredButton><h1 style={{color: "#F5F5F5", lineHeight: "0", padding:"11px 33px"}}>Prepare for Review</h1></CenteredButton>
                            </Link>
                            <p style={{marginTop: "130px"}}>Add metadata to get found easily!</p>
                        </UploadedContentDiv>
                    ))}
                </UploadedContentDivContainer>
            ) : (
                    <EmptyUploadedContentDiv style={{width:"333px", }}>
                        <h1>As a token of thanks, you’ll unlock 1 hour of studio time at Sacred Sound Studio once you upload your first content!</h1>
                    </EmptyUploadedContentDiv>
            )}
            </UploadAndPreviewDivContainer>
            <div style={{display: "flex"}}>
                <ProfileSidebarDiv>
                    <DefaultButton onClick={() => handleSectionChange('component1')} style={{ backgroundColor: activeComponent === 'component1' ? '#A3C4A338' : 'transparent' }}>
                        <ButtonInnerImg src={FaceImg}/>
                        <h1>Your Profile</h1>
                    </DefaultButton>
                    <DefaultButton onClick={() => handleSectionChange('component2')} style={{ backgroundColor: activeComponent === 'component2' ? '#A3C4A338' : 'transparent', marginBottom: "100px" }}>
                        <ButtonInnerImg src={MusicIcon}/>
                        <h1>Your Content</h1>
                    </DefaultButton>
                    <LogoutButton></LogoutButton>
                </ProfileSidebarDiv>
                <ProfileEditSection/>
            </div>
        </>
        {/* ) : (
        <div>
            <p>Please log in to access the Cloud Studio.</p>
        </div>
        )
        } */}
    </>
);
}

const HeaderDiv = styled.div`
    display: flex;
    justify-content: center;
    background-color: #A3C4A338;
    margin-bottom: 5%;
`;

const UploadAndPreviewDivContainer = styled.div`
    display: flex;
    width: 90%;
`;

const UploadDiv = styled.div`
    background-image: url(${props => props.backgroundImage});
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 44%;
    border-radius: 33px;
    background-color: #A3C4A338;
    padding: 33px;
    margin-left: 5%;
    margin-right: 4%;
    height: 222px;
    overflow: hidden;
`;

const ButtonMainContainer = styled.div`
    width: 100%;
    margin: 10px;
    display: flex;
    justify-content: space-between;
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

const UploadButtonColumnDiv = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const CenteredButton = styled.button`
    border: none;
    color: #F5F5F5;
    background-color: #434289;
    border-radius: 33px;
    padding: 11px;
    align-self: center;
    cursor: pointer;
    position: absolute; /* added */
    top: 50%; /* added */
    left: 50%; /* added */
    transform: translate(-50%, -50%); /* added */
`;

const DefaultButton = styled.button`
background-color: transparent;
color: #434289;
border: none;
padding: 11px;
cursor: pointer;
display: flex;
align-items: center;
border-radius: 33px;
`;

const ButtonInnerImg = styled.img`
    margin-right: 10px;
`;

const UploadedContentDivContainer = styled.div`
    display: flex;
    width: 44%;
    overflow-x: auto;
    white-space: nowrap; /* to prevent line breaks */
    ::-webkit-scrollbar{display: none}
    padding-bottom: 10px;
`;

const UploadedContentDiv = styled.div`
    background-image: url(${props => props.backgroundImage});
    background-repeat: no-repeat;
    background-position: 50%;
    background-size: 100% auto;
    background-size: 285px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 33px;
    background-color: #A3C4A338;
    padding: 33px;
    margin-right: 22px;
    height: 222px;
    min-width: 333px;
    text-align: center;
    position: relative; //needed to have button perfectly centered
`;

const EmptyUploadedContentDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 33px;
    background-color: #A3C4A338;
    padding: 33px;
    margin-right: 22px;
    height: 222px;
    min-width: 333px;
    text-align: center;
    position: relative; //needed to have button perfectly centered
`;

const ProfileSidebarDiv = styled.div`
    width:22%;
    height:870px;
    margin:5%;
    display:flex;
    flex-direction:column;
    border-radius: 33px;
    padding: 10px;
`;