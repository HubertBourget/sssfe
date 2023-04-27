import { useAuth0 } from '@auth0/auth0-react';
import styled from 'styled-components';

const LogoutButton = () => {
    const { logout, isAuthenticated } = useAuth0();

    return (
        isAuthenticated && (
            <SingupButton onClick={() => logout()}>
                <h2>Logout</h2>
            </SingupButton>
        )
    )
}

export default LogoutButton

const SingupButton = styled.button`
background-color: transparent;
color: #434289;
border: none;
padding: 11px;
cursor: pointer;
display: flex;
&:hover {
    background-color: #A3C4A338;
    border-radius: 33px;
    }
`;