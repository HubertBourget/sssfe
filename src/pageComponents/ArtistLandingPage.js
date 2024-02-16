import React from 'react';
import logo from '../assets/HorozontalLogoWhiteFont.png';
import { useAuth0 } from '@auth0/auth0-react';
import ExplainerVideo from '../assets/SacredSoundExplainerVideo.mp4';
import styled from 'styled-components';

const ArtistLandingPage = () => {
    const { loginWithRedirect } = useAuth0();;

    const contentStyle = {
        position: 'relative',
        zIndex: 2, // Ensure content sits on top of the tint
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100vh',
        width: '100vw',
        backgroundColor: 'transparent'
    };

    const logoStyle = {
        width: '20vw',
        margin: '4vw'
    };

    const textStyle = {
        color: 'white',
        textAlign: 'right',
        width: '100%',
        backgroundColor:'transparent',
    };

    const buttonStyle = {
    padding: '20px 40px', // Adjust padding to increase the button size
    backgroundColor: '#434289',
    color: 'white',
    border: 'none',
    borderRadius: '0px',
    cursor: 'pointer',
    marginRight: '4vw',
    marginBottom: '10vh',
    display: 'flex', // Flex container for centering content
    justifyContent: 'center', // Center horizontally
    alignItems: 'center', // Center vertically
    fontSize: '20px, 30px', // Adjust font size as needed
};

// Style for the second section
    const secondSectionStyle = {
        display: 'flex',
        minHeight: '100vh', // Ensure this section is also at least the height of the viewport
        backgroundColor: '#f8f8f8', // Replace with your desired background color
        padding: '4vw',
        alignItems:'center',
        boxShadow: 'rgb(0 0 0 / 20%) 0px 2px 2px 0px', 
    };

    const leftColumnStyle = {
        backgroundColor: '#A3C4A3', // Adjust to the color used in your design
        width: '50%', // Half the width of the container
        padding: '4vw',
        margin: '3vw',
        boxSizing: 'border-box', // Ensure padding is included in the width
        backgroundImage: 'green', // Use the green tint here if applicable
        backgroundSize: 'cover',
        height:'70vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
    };

    const rightColumnStyle = {
        width: '50%', // Half the width of the container
        padding: '4vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        boxSizing: 'border-box',
    };

    // Style for the third section
    const thirdSectionStyle = {
        display: 'flex',
        padding: '4vw',
        boxShadow: 'rgb(0 0 0 / 20%) 0px 2px 2px 0px',
        marginBottom: '2px', // Add a small margin to reveal the shadow
    };

    const leftTextStyle = {
        width: '50%', // Half the width of the container
        padding: '4vw',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    };

    const rightVideoStyle = {
        width: '50%', // Make sure the video fills the width, // Make sure the video fills the height
        overflow: 'hidden', // Hide any overflow
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    };

    const fourthSectionStyle = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh', // Adjust the height as needed
        backgroundColor: '#f8f8f8', // Replace with the background color for this section
    };

    const headingStyle = {
        color: '#434289', // Replace with the color of the heading
        fontSize: '4em', // Adjust the font size as needed
        margin: '20px 0', // Adjust the spacing as needed
    };

    const ctaButtonStyle = {
        padding: '10px 20px',
        backgroundColor: '#434289', // Replace with the button color
        color: 'white',
        border: 'none',
        borderRadius: '0px',
        cursor: 'pointer',
        fontSize: '1em', // Adjust the font size as needed
        textTransform: 'uppercase', // Capitalize button text
        letterSpacing: '1px', // Adjust letter spacing as needed
        outline: 'none',
    };

    return (
        <>
        <SectionDiv>
            <TintedOverlay/>
            <div style={contentStyle}>
            <img src={logo} alt="Logo" style={logoStyle} />
            <div style={textStyle}>
                <h1 style={{ color: 'white', marginRight: '3vw', fontSize:'70px', marginBottom:'10vh' }}>
                Amplify Your Sacred <br /> Music Journey
                </h1>
                <div style={{display:'flex', flexDirection:'row-reverse', backgroundColor:'transparent'}}>
                <button style={buttonStyle} onClick={() =>
                    loginWithRedirect({
                    redirectUri: process.env.REACT_APP_REDIRECTURL, //this for staging : https://staging.sacredsound.pages.dev/studio 
                    })
                }>
                    Get Started
                </button>
                </div>
            </div>
            </div>
        </SectionDiv>

        {/* Second section */}
        <div style={secondSectionStyle}>
            <div style={leftColumnStyle}>
            <h1 style={{fontSize:'70px', color:'white'}}>Welcome to Sacred Sound</h1>
            <h2 style={{color:'white'}}>A Platform for Artists to Share Sacred Music and Connect with a Global Community.</h2>
            </div>
            <div style={rightColumnStyle}>
            <h2 style={{fontSize:'35px'}}>Connect with a Global Audience</h2>
            <p style={{fontSize:'22px'}}>Share your sacred music with a community that values and resonates with your art.</p>
            <h2 style={{fontSize:'35px'}}>Monetize Your Talent</h2>
            <p style={{fontSize:'22px'}}>Earn thanks coins for your music, redeemable for studio time to support your creative process.</p>
            <h2 style={{fontSize:'35px'}}>Collaborate and Learn</h2>
            <p style={{fontSize:'22px'}}>Engage with fellow artists, join lessons, and expand your musical horizons.</p>
            </div>
        </div>

        {/* Third section */}
        <div style={thirdSectionStyle}>
            <div style={leftTextStyle}>
                <h2 style={{fontSize:'50px'}}>Join the Sacred Sound Community as an Artist</h2>
                <p style={{fontSize:'22px'}}>Share your transformative creations with a global audience, earn thanks coins for your craft, and connect with like-minded creators.</p>
            </div>
            <div style={rightVideoStyle}>
                    <video 
                        src={ExplainerVideo} 
                        controls 
                        style={{ width: '90%', height: 'auto', objectFit: 'cover',  marginLeft: '5vw' }} // Adjust the width and height as needed
                    >
                        Your browser does not support the video tag.
                    </video>
                </div>
        </div>
        
    {/* Fourth section */}
        <div style={fourthSectionStyle}>
            <h2 style={headingStyle}>Ready to Share Your Sound?</h2>
            <button style={ctaButtonStyle} onClick={() =>
                    loginWithRedirect({
                    redirectUri: process.env.REACT_APP_REDIRECTURL, //this for staging : https://staging.sacredsound.pages.dev/studio 
                    })
                }>
                Start Your Musical Journey
            </button>
        </div>
        </>
    );
}

export default ArtistLandingPage;

const SectionDiv = styled.div`
    position: relative;
    height: 100vh;
    background-image: url('https://firebasestorage.googleapis.com/v0/b/staging-sacred-sound-f472b.appspot.com/o/Assets%2FArtistLandingPageBackgroundImage.png?alt=media&token=6896cce6-8c4a-44f3-91e6-7ef2fc2f51a7');
    background-size: cover;
    background-position: center;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    overflow: hidden; // Ensures no overflow from children
    z-index: 0; // Under the overlay
`;

const TintedOverlay = styled.div`
    position: relative;
    display: inline-block; // or 'block' depending on your layout

    &:before {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.2); // This creates the 20% black tint
        z-index: 1;
    }

    img {
    display: block;
    width: 100%; // or 'auto' depending on your needs
    height: auto; // or your custom height
    z-index: 0;
    }
`;

const LandingPageImage = styled.img`
    background-size: cover;
    background-position: center;
    height: 100vh;
    width: 100vw;
    position: relative;
`;