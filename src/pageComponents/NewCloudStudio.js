import React from 'react';
import { useState, useRef } from 'react';
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

export default function NewCloudStudio() {
    //change this for Prod:
    //3 of those now:
    const user = {
        name: "debug7e@debug.com",
    };
    //with a user.name useEffect.

    //Navigation, viewStates and button flow:
    const [isUploadActive, setIsUploadActive] = useState(false);
    const [activeComponent, setActiveComponent] = useState('component1');
    const [isSlideIn, setIsSlideIn] = useState(false);
    const [publishClicked, setPublishClicked] = useState(false);
    const [uploadViewState, setUploadViewState] = useState("initial");
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
        setUploadViewState("initial");
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
    const debouncedUpdate = useRef(debounce(async (trackId, key, value) => {
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
}, 3000)).current;
    // Function to handle changes in track details
    const handleTrackDetailChange = (trackId, key, value) => {
        debouncedUpdate({ trackId, key, value });
};

// brigning fileUploadArray in the top level:
const [fileUploadsArray, setFileUploadsArray] = useState([]);



    return (
        <MainContainer>
            <HeaderContainer>
                <HeaderLeft>
                    {!isUploadActive && (
                        <Logo>
                        Sacred Sounds
                        Cloud Studio
                        </Logo>
                    )}
                </HeaderLeft>
                <HeaderRight>
                    {!isUploadActive && (
                        <UploadAndAccountDiv>
                            <CustomButton onClick={() => {handleUploadClick();}}> Upload </CustomButton>
                            <CustomButton>Account</CustomButton>
                        </UploadAndAccountDiv>
                    )}                   
                </HeaderRight>
            </HeaderContainer>
            
            <FlexContainer>
                <NavigationPanel>
                    <NavigationButton onClick={() => handleSectionChange('component1', false)} active={activeComponent === 'component1'}>Dashboard</NavigationButton>
                    <NavigationButton onClick={() => handleSectionChange('component2', false)} active={activeComponent === 'component2'}>Your Content</NavigationButton>
                    <NavigationButton onClick={() => handleSectionChange('component3', false)} active={activeComponent === 'component3'}>Your Channel</NavigationButton>
                    <SeparatorDiv/>
                    <NavigationButton onClick={() => handleSectionChange('component4', false)} active={activeComponent === 'component4'}>Feedback</NavigationButton>
                    <BottomNavigationPanel/>
                </NavigationPanel>
                <ScrollableFlexThree isUploadActive={isUploadActive}>
                    {activeComponent === "component1" && <Dashboard user={user?.name.toString()} />}
                    {activeComponent === "component2" && (<ContentTab user={user?.name.toString()} />)}
                    {activeComponent === "component3" && <YourChannel user={user?.name.toString()} />}
                    {activeComponent === "component4" && <Feedback user={user?.name.toString()} />}
                    <UploadPopup slideIn={isSlideIn}>
                        <TopUploadSection style={{height: '12vh'}}>
                            <CloseButton onClick={handleCloseClick}>Close</CloseButton>
                            {isUploadActive && uploadViewState === "albumCreation" && (
                            <NextButton onClick={handleNextButtonClick} style={{display:'flex', flexDirection:'row-reverse'}}>Next</NextButton>)}
                            
                            {isUploadActive && uploadViewState === "fileDetail" && (
                            <NextButton onClick={handlePublishButtonClick} style={{display:'flex', flexDirection:'row-reverse'}}>Publish</NextButton>)}
                        </TopUploadSection>
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
                            />
                        )}
                    </UploadPopup>
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
    box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.2);
`;

const HeaderLeft = styled.div`
    
    flex: 1;
    width: 100%;
    height: 12vh;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
    margin-bottom: 10px;
    position: relative;
    overflow: hidden;
`;

const HeaderRight = styled.div`
flex: 3;
display:'flex';
flex-direction:'end';
`;

const UploadAndAccountDiv = styled.div`
    flex: 3 1 0%;
    display: flex;
    justify-content: flex-end;
`;


const FlexContainer = styled.div`
    display: flex;
    height: 100%;
    overflow: hidden;
`;

const NavigationPanel = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    background-color: #f0f0f0;
    padding: 10px;
    height: 80vh;
`;

const Logo = styled.div`
    height: 100%;
    font-size: 1.5em;
    margin-bottom: 10px;
`;

const CustomButton = styled.button`
    background-color: black;
    color: white;
    margin-left: 1vw;
    margin-right: 1vw;
    padding: 10px

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

const UploadPopup = styled.div`
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

const NextButton = styled.button`
    border: none;
    color: rgb(245, 245, 245);
    background-color: rgb(67, 66, 137);
    border-radius: 33px;
    padding: 7px 73px;
    cursor: pointer;
    margin-right: 4vw;
    font-size: 20px;
    height: 6vh;
    align-items: center;
`;

const TopUploadSection = styled.div`
    height: 12vh;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    box-shadow: 0px 4px 4px -2px rgba(0,0,0,0.3);
        align-items: center;
`;