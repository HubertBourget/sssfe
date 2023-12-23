import { useAuth0 } from '@auth0/auth0-react';
import styled from 'styled-components';
import { GlobalStyle } from '../components/GlobalStyle';

const LoginButton = () => {
    const { loginWithRedirect, isAuthenticated } = useAuth0();

    return (
      !isAuthenticated && (
        <SingupButton
          onClick={() =>
            loginWithRedirect({
              redirectUri: "https://staging.sacredsound.pages.dev/studio", //Change this Uri for prod: "https://sacredsound.app/studio" or to this uri for local testing : "http://localhost:3000/studio"
            })
          }
        >
          <LoginFonts>Become a Resident Artist</LoginFonts>
        </SingupButton>
      )
    );
}

export default LoginButton

const SingupButton = styled.button`
border: none;
color: #F5F5F5;
background-color: #434289;
border-radius: 33px;
padding: 11px;
cursor: pointer;
@media (max-width: 768px) {display: none;} //for the /create page
`;

const LoginFonts = styled.h2`
    font-family: 'Outfit', sans-serif;
    font-weight: 500;
    line-height: 1.2;
    margin-bottom: 1rem;
    color: #F5F5F5;
    font-size: 18px;
`;