import React from 'react';
import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import NavigationButton from '../components/CloudStudioComponents/NavigationButton';
import Dashboard from '../components/CloudStudioComponents/Dashboard';
import ContentTab from '../components/CloudStudioComponents/ContentTab';
import YourChannel from '../components/CloudStudioComponents/YourChannel';
import Feedback from '../components/CloudStudioComponents/Feedback';
import Upload from '../components/CloudStudioComponents/Upload';
import { v4 } from 'uuid';
import { debounce } from 'lodash';
import axios from 'axios';
import ProfileCircle from '../assets/ProfileCircle.png';
import HorizontalLogo from '../assets/HorizontalLogo.png';
import UploadIcon from '../assets/UploadIcon.png';
import DashboardIcon from '../assets/DashboardIcon.png';
import YourContentIcon from '../assets/ContentIcon.png'
import YourChanneltIcon from '../assets/YourChannelIcon.png';
import FeedbackIcon from '../assets/FeedbackIcon.png';
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate, useNavigate } from 'react-router'; 
import LoginButton from '../components/LoginButton';
import VideoPlayer from '../components/CloudStudioComponents/VideoPlayer'

export default function NewCloudStudio() {
    const { user, isAuthenticated } = useAuth0();
    // const user = { name: "debug9@debug.com" };
    // const isAuthenticated = true;

    //Navigation, viewStates and button flow:
    const [isUploadActive, setIsUploadActive] = useState(false);
    const [activeComponent, setActiveComponent] = useState('component1');
    const [isSlideIn, setIsSlideIn] = useState(false);
    const [publishClicked, setPublishClicked] = useState(false);
    const [uploadViewState, setUploadViewState] = useState("initial");
    const navigate = useNavigate();

    //Verify via the Auth0 Hook if the user has an account inside MongoDb, if not it redirect the user toward the AccountNameSelectionPage
    useEffect(() => {
        const fetchUser = async () => {
        try {
            if (user && user.name) {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/b_getUserExist/${user.name}`);
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
            navigate('/AccountNameSelection');
            } else {
            console.log('Error:', error.message);
            }
        }
    };
    fetchUser();
    }, [user?.name]);

    const handleSectionChange = (componentName, isUploading) => {
        setIsUploadActive(isUploading);
        setActiveComponent(componentName);
    };
    const handlePublishHandled = () => {
            setPublishClicked(false); // Reset the state
        };
    const handlePublishButtonClick = () => {
        debouncedUpdate.flush(); // Flush any pending updates
        setPublishClicked(true);
    };
    const resetUploadState = () => {
        setAlbumId(null);
        setAlbumTitle('');
        setAlbumDescription('');
        setVisibility('public');
        setUploadViewState("initial");
        setReorderedFiles([]);
        setFileUploadsArray([]);
    };
    const onAllUpdatesComplete = () => {
    // Logic to close the component or update the UI
    resetUploadState()
    setIsSlideIn(false); 
    setIsUploadActive(false); 
    setActiveComponent('component1');
    };
    const handleUploadClick = () => {
        setAlbumId(v4());
        setIsSlideIn(false);
        //After a short delay, set isSlideIn to true to trigger the animation
        setTimeout(() => {
            handleSectionChange('component5', true);
            setIsSlideIn(true); // Trigger the slide-in animation
        }, 9);
    };
    const handleCloseClick = () => {
        resetUploadState()
        setIsSlideIn(false); // Hide the UploadPopup
        setIsUploadActive(false); // Show the Upload and Account buttons
        setActiveComponent('component1'); // Optionally, reset to the default component view
    };
    const handleStateChange = (newViewState) => {
        // Update the state that controls the viewState of the Upload component
        setUploadViewState(newViewState);
    };

    // Function & useStates to handle album data update:
    const [albumId, setAlbumId] = useState(null);
    const [albumTitle, setAlbumTitle] = useState('');
    const [albumDescription, setAlbumDescription] = useState('');
    const [visibility, setVisibility] = useState('public'); // Default value set to 'public'
    //lifting the state up of the array order inside the album:
    const [reorderedFiles, setReorderedFiles] = useState([]);
    const updateReorderedFiles = (newFiles) => {
        console.log('updateReorderedFiles :', newFiles )
    setReorderedFiles(newFiles);
    };
    const handleAlbumDataChange = (key, value) => {
        console.log('handleAlbumDataChange: ', key, value)
    if (key === "description") setAlbumDescription(value);
    if (key === "visibility") setVisibility(value);
    if (key === "albumTitle") setAlbumTitle(value);
    if (key === "albumOrder") setReorderedFiles(value);
    };
    //On buttonNext click, sends the request ot sets the albumData in MongoDb and change the viewState
    const handleNextButtonClick = () => {
        // Prepare the album data
        const albumData = {
            albumId: albumId,
            title: albumTitle,
            description: albumDescription,
            visibility: visibility,
            albumOrder: reorderedFiles,
        };
        console.log('inspecting albumData: ', albumData)
        // Call the function to update album metadata
        handleAlbumMetaDataUpdate(albumData);
        // Change the view state
        setUploadViewState("fileDetail");
    };
    //The album update API call:
    const handleAlbumMetaDataUpdate = async (albumData) => {
        const { albumId, title, description, visibility, albumOrder } = albumData;
        console.log("albumData: ", albumData);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/updateAlbumMetaData`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ albumId, title, description, visibility, albumOrder }),
            });
            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.error('Error updating album metadata:', error);
        }
    };


    // Function & useStates to handle tracks data update:
    // Define the debounced function
    const debouncedUpdate = useRef(debounce(async (trackId) => {
        console.log(trackId);
        const itemId = trackId.trackId.toString();
        const itemKey = trackId.key;
        const itemValue = trackId.value;
        console.log("itemId::", itemId);
        console.log("key::", itemKey);
        console.log("value::", itemValue);
    const dataToUpdate = { [itemKey]: itemValue };

    if (!itemId || itemValue === undefined) {
        console.log("Invalid itemId or value", { itemId, itemValue });
        return;
    }

    try {
        console.log('Sending data:', { videoId: itemId, ...dataToUpdate });
        const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/updatePartialContentMetaData`, {
            videoId: itemId,
            ...dataToUpdate
        });
        console.log('Response:', response.data);
    } catch (error) {
        console.error('Error updating data:', error);
    }
}, 100)).current;
    // Function to handle changes in track details
    const handleTrackDetailChange = (trackId, key, value) => {
        debouncedUpdate({ trackId, key, value });
};

// brigning fileUploadArray in the top level:
const [fileUploadsArray, setFileUploadsArray] = useState([]);
useEffect(() => {
    fileUploadsArray.forEach(file => {
        if (!trackDetails.some(detail => detail.id === file.videoId)) {
            const newTrack = {
                id: file.videoId,
                visibility: 'public', // Default value
                category: 'music video', // Default value
                albumId:albumId,
                // ... other default values
            };

            setTrackDetails(prevDetails => [...prevDetails, newTrack]);
        }
    });
}, [fileUploadsArray]);


const [trackDetails, setTrackDetails] = useState([]);

    //Conditionnal rendering to make sure the user is authenticated.
    if (!isAuthenticated) {
        return (
        <div style={{display:"flex", flexDirection:'column', width:'100%', alignItems:'center'}}>
            <p>Please log in to access the Cloud Studio.</p>
            <LoginButton/>
        </div>
        );
    }

    return (
        <MainContainer>
            <HeaderContainer>
                <HeaderLeft>
                    {!isUploadActive && (
                        <Logo>
                        </Logo>
                    )}
                </HeaderLeft>
                <HeaderRight>
                    {!isUploadActive && (
                        <UploadAndAccountDiv>
                            <button onClick={() => {handleUploadClick();}}
                            style={{display:'flex'}}>
                                <img src={UploadIcon} alt="Upload" style={{ marginRight: '8px'}}/>
                                <div style={{alignItems:'center', color:'white'}}>
                                    Upload
                                </div>
                            </button>
                            <AccountButton></AccountButton>
                        </UploadAndAccountDiv>
                    )}                   
                </HeaderRight>
            </HeaderContainer>
            
            <FlexContainer>
                <NavigationPanel>
                    <NavigationButton onClick={() => handleSectionChange('component1', false)} active={activeComponent === 'component1'}>
                        <img src={DashboardIcon} alt="Upload" style={{ marginRight: '8px'}}/>
                        Dashboard
                    </NavigationButton>
                    <NavigationButton onClick={() => handleSectionChange('component2', false)} active={activeComponent === 'component2'}>
                        <img src={YourContentIcon} alt="Your Channel" style={{ marginRight: '8px'}}/>
                        Your Content
                    </NavigationButton>

                    {/* Disabling in current build */}
                    {/* <NavigationButton onClick={() => handleSectionChange('component3', false)} active={activeComponent === 'component3'}>
                        <img src={YourChanneltIcon} alt="Upload" style={{ marginRight: '8px'}}/>
                        Your Channel
                    </NavigationButton>
                    */}
                    <SeparatorDiv/>
                    <NavigationButton 
                        onClick={() => window.location.href = 'mailto:feedback@sacredsound.app'}> {/* active={activeComponent === 'component4'} */}
                        
                        <img src={FeedbackIcon} alt="Feedback" style={{ marginRight: '8px'}}/>
                        Feedback
                    </NavigationButton>

                    <BottomNavigationPanel/>
                </NavigationPanel>
                <ScrollableFlexThree isUploadActive={isUploadActive}>
                    {activeComponent === "component1" && <Dashboard user={user?.name.toString()} />}
                    {activeComponent === "component2" && (<ContentTab user={user?.name.toString()} />)}
                    {activeComponent === "component3" && <YourChannel user={user?.name.toString()} />}
                    {activeComponent === "component4" && <Feedback user={user?.name.toString()} />}
                    <PopupComponentWithSlideIn slideIn={isSlideIn}>
                        <TopHeaderSection style={{height: '12vh'}}>
                            <CloseButton onClick={handleCloseClick}>Close</CloseButton>
                            {isUploadActive && uploadViewState === "albumCreation" && (
                            <button onClick={handleNextButtonClick} style={{display:'flex', flexDirection:'row-reverse', marginRight:'3vw'}}>Next</button>)}
                            
                            {isUploadActive && uploadViewState === "fileDetail" && (
                            <button onClick={handlePublishButtonClick} style={{display:'flex', flexDirection:'row-reverse', marginRight:'3vw'}}>Publish</button>)}
                        </TopHeaderSection>
                        {activeComponent === "component5" && (
                            <Upload
                            reorderedFiles={reorderedFiles}
                            onUpdateReorderedFiles={updateReorderedFiles}
                            onAllUpdatesComplete = {onAllUpdatesComplete}
                            publishClicked={publishClicked}
                            handlePublishHandled={handlePublishHandled}
                            viewState={uploadViewState}
                            albumTitle={albumTitle}
                            albumDescription={albumDescription}
                            visibility={visibility}
                            onAlbumDataChange={handleAlbumDataChange}
                            onStateChange={handleStateChange}
                            albumId={albumId} 
                            onTrackDetailChange={handleTrackDetailChange}
                            fileUploadsArray={fileUploadsArray}
                            setFileUploadsArray={setFileUploadsArray}
                            trackDetails={trackDetails}
                            />
                        )}
                        
                    </PopupComponentWithSlideIn>
                    </ScrollableFlexThree>
                    </FlexContainer>
        </MainContainer>
    );
}

const MainContainer = styled.div`
height: 100%;
width: 100%;
overflow: hidden;
`;

const HeaderContainer = styled.div`
    display: flex;
    flex-direction: row;
    height: 12vh;
`;

const HeaderLeft = styled.div`
    width: 24%;
    height: 12vh;
    justify-content: space-between;
    align-items: center;
    position: relative;
    overflow: hidden;
    border-right: 1px solid rgb(191, 187, 187);
`;

const HeaderRight = styled.div`
flex: 3;
display:'flex';
flex-direction:'end';
`;

const UploadAndAccountDiv = styled.div`
    flex: 3;
    display: flex;
    justify-content: flex-end;
    height: 100%;
    align-items: center;
`;


const FlexContainer = styled.div`
    display: flex;
    height: 100%;
    overflow: hidden;
`;

const NavigationPanel = styled.div`
    display: flex;
    flex-direction: column;
    height: 80vh;
    border-right: 1px solid rgb(191, 187, 187);
    width: 24%;
`;

const Logo = styled.div`
    height: 100%;
    font-size: 1.5em;
    margin-left: 1vw;
    background-image: url(${HorizontalLogo});
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
`;

const AccountButton = styled.button`
    background-color: transparent;
    margin-left: 1vw;
    margin-right: 1vw;
    background-image: url(${ProfileCircle});
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    height: 7vh;
`;

const SeparatorDiv = styled.div`
    position: relative;
    margin-top: 10px;
    margin-bottom: 10px;

    ::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%); /* Center the border horizontally */
        width: 90%;
        height: 1px;
        background-color: #bfbbbb;
    }
`;

const BottomNavigationPanel = styled.div`
    flex: 2;
    padding: 10px;
    margin-bottom: 10px;
`;

const ScrollableFlexThree = styled.div`
    flex: 3;
    overflow-y: ${props => props.isUploadActive ? 'hidden' : 'auto'};
`;

const PopupComponentWithSlideIn = styled.div`
    position: fixed;
    top: 0vh;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    background-color: white;
    z-index: 1;
    transform: translateX(${props => props.slideIn ? '0' : '100vw'});
    transition: transform 0.5s ease-out;
    overflow-y: auto;
`;

const PopupComponent = styled.div`
    position: fixed;
    top: 0vh;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    background-color: white;
    z-index: 1;
    overflow-y: auto;
`;

const CloseButton = styled.button`
    background-color: rgb(0, 0, 0, 0);
    border: none;
    cursor: pointer;
    border-radius: 5px;
    font-size: 20px;
    color: rgb(67, 66, 137);
    text-decoration: underline;
    margin-left: 3vw;
    padding: 0px;
`;

const TopHeaderSection = styled.div`
    height: 12vh;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    box-shadow: 0px 4px 4px -2px rgba(0,0,0,0.3);
    align-items: center;
`;