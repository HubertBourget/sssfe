import React, { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from "react-router-dom";
import styled from 'styled-components';
import MandalaBG from '../assets/MandalaAlpha.png';
import axios from 'axios';
import LoginButton from '../components/LoginButton';
import { GlobalStyle } from '../components/GlobalStyle';


export default function ArtistAccountNameSelectionPage() {
  const { user, isAuthenticated } = useAuth0();
  const [accountName, setAccountName] = useState('');
  const [buttonText, setButtonText] = useState('Get Started');
  const [accountNameTaken, setAccountNameTaken] = useState(false);
  const [accountAvailableAlert, setAccountAvailableAlert] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
        const getCheckAccountName = async () => {
            try {
            const response = await axios.get(`https://jellyfish-app-tj9ha.ondigitalocean.app/api/getCheckAccountName`, {
                params: {
                email: user.name,
                accountName: accountName,
                },
            });

                if (response.data.taken) {

                    setAccountAvailableAlert(response.data.message);
                    setAccountNameTaken(true);
                }
                else {
                    setAccountAvailableAlert(response.data.message);
                    setAccountNameTaken(false);
                }
                
            } catch (error) {
                console.error(error);
            }
        };
        if (accountName) {
            getCheckAccountName();
        }
    }, [accountName]);

  const handleAccountNameChange = (event) => {
    setAccountName(event.target.value);
  };

  const buttonClickHandler = (event) => {
    setAccountNameTaken(true);
    setButtonText("Good! One moment...")
    postNewUserWithAccountName()
  };

const postNewUserWithAccountName = () => {
  const timestamp = new Date().toISOString();
  fetch('https://jellyfish-app-tj9ha.ondigitalocean.app/api/postNewUserWithAccountName', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      email: user.name,
      accountName: accountName,
      isArtist: true,
      timestamp: timestamp,
    }),
  })
  .then((res) => res.json())
  .then(() => {
    setTimeout(() => {
      navigate('/studio');
    }, 3000);
  });
};

//Conditionnal rendering to make sure the user is authenticated.
if (!isAuthenticated) {
    return (
      <div style={{display:"flex", flexDirection:'column', width:'30%', alignItems:'center'}}>
        <p>Please log in to access the Cloud Studio.</p>
      </div>
    );
  }

    return (
      <ContainerDiv>
        <GlobalStyle/>
          <BackgroundDiv/>
          <div style={{backgroundColor:'white', zIndex:'1', borderRadius:'33px'}}>
          <WrapperDiv backgroundImage={MandalaBG}>
              <h2 style={{color: "black"}}>Welcome, friend, to Sacred Sound.</h2>
              <h2 style={{color: "black", marginTop:"25px"}}>Enter the name for your public profile, and get <br/>started uploading your best quality sacred sound.</h2>
              <p style={{color: "#434289", lineHeight: "0", marginTop:"25px"}}>Choose your account name.</p>
              <input type="text" style={{borderRadius:"33px", width:"90%"}} onChange={handleAccountNameChange} />
              <div>{accountAvailableAlert}</div>
              <CenteredButton disabled={accountNameTaken} onClick={buttonClickHandler}><h1 style={{color: "#F5F5F5", lineHeight: "0"}}>{buttonText}</h1></CenteredButton>
          </WrapperDiv>
          </div>
      </ContainerDiv>
      )
}


const ContainerDiv = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BackgroundDiv = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 0;
`;

const WrapperDiv = styled.div`
  background-image: url(${props => props.backgroundImage});
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  position: relative;
  z-index: 3;
  border-radius: 33px;
  padding: 20px;
  background-color: rgba(163, 196, 163, 0.22);

`;

const CenteredButton = styled.button`
    border: none;
    color: #F5F5F5;
    background-color: #434289;
    border-radius: 33px;
    align-self: center;
    cursor: pointer;
    width: 100%;
    margin-top: 20px;
    padding: 11px;
    `;