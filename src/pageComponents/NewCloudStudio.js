import React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import ProfileCircle from '../assets/ProfileCircle.png';
import NavigationButton from '../components/CloudStudioComponents/NavigationButton';
import Dashboard from '../components/CloudStudioComponents/Dashboard';
import ContentTab from '../components/CloudStudioComponents/ContentTab';
import YourChannel from '../components/CloudStudioComponents/YourChannel';
import Feedback from '../components/CloudStudioComponents/Feedback';

export default function NewCloudStudio() {
    //change this for Prod:
    const user = {
        name: "debug2@debug.com",
    };
    //with a user.name useEffect.

    const [activeComponent, setActiveComponent] = useState('component1');
    const handleSectionChange = (componentName) => {
    setActiveComponent(componentName);
    };



    return (
        <MainCOntainer>
            <Header>
                <Logo>
                    Sacred Sounds
                    Cloud Studio
                </Logo>
                <div>
                    <UploadButton>Upload</UploadButton>
                    <AccountButton>Account</AccountButton>
                </div>
                
            </Header>
            <FlexContainer>
                <NavigationPanel>
                    <NavigationButton onClick={() => handleSectionChange('component1')} active={activeComponent === 'component1'}>Dashboard</NavigationButton>
                    <NavigationButton onClick={() => handleSectionChange('component2')} active={activeComponent === 'component2'}>Your Content</NavigationButton>
                    <NavigationButton onClick={() => handleSectionChange('component3')} active={activeComponent === 'component3'}>Your Channel</NavigationButton>
                    <SeparatorDiv/>
                    <NavigationButton onClick={() => handleSectionChange('component4')} active={activeComponent === 'component4'}>Feedback</NavigationButton>
                    <BottomNavigationPanel/>
                </NavigationPanel>
                <ScrollableFlexThree>
                    {activeComponent === "component1" && <Dashboard user={user?.name.toString()} />}
                    {activeComponent === "component2" && (<ContentTab user={user?.name.toString()} />)}
                    {activeComponent === "component3" && <YourChannel user={user?.name.toString()} />}
                    {activeComponent === "component4" && <Feedback user={user?.name.toString()} />}
                </ScrollableFlexThree>
            </FlexContainer>
        </MainCOntainer>
    );
}

const MainCOntainer = styled.div`
height: 100%;
width: 100%;
overflow: hidden;
`;

const Header = styled.div`
    flex-direction: row;
    width: 100%;
    height: 12vh;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
    margin-bottom: 10px;
    position: relative;
    overflow: hidden;
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

const UploadButton = styled.button`
    background-color: black;
    color: white;
    margin-left: 1vw;
    margin-right: 1vw;
    padding: 10px

`;

const AccountButton = styled.button`
    background-color: black;
    color: white;
    margin-left: 1vw;
    margin-right: 1vw;
    padding: 10px;

    /* background-image: url(${ProfileCircle});
    background-repeat: no-repeat;  */
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
    overflow-y: auto;
`;
