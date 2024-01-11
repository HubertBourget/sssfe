import React from 'react';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import NavigationButton from '../components/CloudStudioComponents/NavigationButton';
import Dashboard from '../components/CloudStudioComponents/Dashboard';
import ContentTab from '../components/CloudStudioComponents/ContentTab';
import YourChannel from '../components/CloudStudioComponents/YourChannel';
import Feedback from '../components/CloudStudioComponents/Feedback';
import Upload from '../components/CloudStudioComponents/Upload';
import { v4 } from 'uuid';

export default function NewCloudStudio() {
    //change this for Prod:
    const user = {
        name: "debug7e@debug.com",
    };
    //with a user.name useEffect.

    const [isUploadActive, setIsUploadActive] = useState(false);
    const [activeComponent, setActiveComponent] = useState('component1');
    const [isSlideIn, setIsSlideIn] = useState(false);
    const [publishClicked, setPublishClicked] = useState(false);
    const handleSectionChange = (componentName, isUploading) => {
        setIsUploadActive(isUploading);
        setActiveComponent(componentName);
    };
    const [uploadViewState, setUploadViewState] = useState("initial");

    //states for album data:
    const [albumId, setAlbumId] = useState(null);
    const [albumTitle, setAlbumTitle] = useState('');
    const [albumDescription, setAlbumDescription] = useState('');
    const [visibility, setVisibility] = useState('public'); // Default value set to 'public'
    // Function to handle album data update
    const handleAlbumDataChange = (key, value) => {
    if (key === "description") setAlbumDescription(value);
    if (key === "visibility") setVisibility(value);
    if (key === "albumTitle") setAlbumTitle(value);
    };

const handleNextButtonClick = () => {
    // Prepare the album data
    const albumData = {
        albumId: albumId,
        title: albumTitle,
        description: albumDescription,
        visibility: visibility,
    };
    // Call the function to update album metadata
    handleAlbumMetaDataUpdate(albumData);
    // Change the view state
    setUploadViewState("fileDetail");
};

const handlePublishHandled = () => {
        setPublishClicked(false); // Reset the state
    };

const handlePublishButtonClick = () => {
    console.log("Publish button clicked");
    setPublishClicked(true);
};

const resetUploadState = () => {
    setUploadViewState("initial");
    // Add other state resets if needed, e.g., setFileUploadsArray([])
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

const handleAlbumMetaDataUpdate = async (albumData) => {
    const { albumId, title, description, visibility } = albumData;

    try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/updateAlbumMetaData`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ albumId, title, description, visibility }),
        });
        const result = await response.json();
        console.log(result);
        // Additional handling based on result
    } catch (error) {
        console.error('Error updating album metadata:', error);
    }
};


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
                        <CloseButton onClick={handleCloseClick}>Close</CloseButton>
                        {isUploadActive && uploadViewState === "albumCreation" && (
                        <div style={{display:'flex', flexDirection:'row-reverse'}}>
                        <NextButton onClick={handleNextButtonClick}>Next</NextButton>
                        </div>
                        )}

                        {isUploadActive && uploadViewState === "fileDetail" && (
                        <div style={{display:'flex', flexDirection:'row-reverse'}}>
                        <NextButton onClick={handlePublishButtonClick}>Publish</NextButton>
                        </div>
                        )}
                        {activeComponent === "component5" && (
                            <Upload
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
    background-color: #f5f5f5;
    border: none;
    cursor: pointer;
    border-radius: 5px;
    font-size: 20px; 
    color: #434289;
    text-decoration: underline;
    margin-top: 4vh;
    margin-left: 4vw;
`;

const NextButton = styled.button`
    border: none;
    color: #F5F5F5;
    background-color: #434289;
    border-radius: 33px;
    padding: 15px 40px;
    cursor: pointer;
    margin-top: 4vh;
    margin-right: 4vw;
    font-size: 20px; 
`;