import React from 'react';
import backgroundImage from '../assets/ArtistLandingPageBackgroundImage.png';
import logo from '../assets/HorozontalLogoWhiteFont.png';
import Tint from '../assets/ArtistLandingPageTint.png';

const ArtistLandingPage = () => {
    // Style for the first section
    const sectionStyle = {
        position: 'relative',
        height: '100vh',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        width: "100%"
    };

    const tintStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `url(${Tint})`,
        backgroundSize: 'cover',
        zIndex: 1, // Ensure it sits on top of the background image but below text/logo
    };

    const contentStyle = {
        position: 'relative',
        zIndex: 2, // Ensure content sits on top of the tint
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        width: '100%'
    };

    const logoStyle = {
        width: '20vw',
        margin: '4vw'
    };

    const textStyle = {
        color: 'white',
        textAlign: 'right',
        width: '100%'
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
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
    };

    const leftColumnStyle = {
        backgroundColor: '#A3C4A3', // Adjust to the color used in your design
        width: '50%', // Half the width of the container
        padding: '4vw',
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
        width: '50%', // Half the width of the container
        padding: '4vw',
        boxSizing: 'border-box',
        // Add styles for the video or image placeholder here
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black', // Placeholder background color
    };

    return (
        <>
        <div style={sectionStyle}>
            <div style={tintStyle} /> {/* Tint overlay */}
            <div style={contentStyle}>
            <img src={logo} alt="Logo" style={logoStyle} />
            <div style={textStyle}>
                <h1 style={{ color: 'white', marginRight: '3vw', fontSize:'70px', marginBottom:'10vh' }}>
                Amplify Your Sacred <br /> Music Journey
                </h1>
                <div style={{display:'flex', flexDirection:'row-reverse'}}>
                <button style={buttonStyle} onClick={() => {/* Handle click event */}}>
                    Get Started
                </button>
                </div>
            </div>
            </div>
        </div>

        {/* Second section */}
        <div style={secondSectionStyle}>
            <div style={leftColumnStyle}>
            <h1 style={{fontSize:'70px', color:'white'}}>Welcome to Sacred Sound Studios</h1>
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
            {/* Replace with actual video or image placeholder */}
            {/* <img src={videoPlaceholder} alt="Video Placeholder" /> */}
            <div> {/* Placeholder for video, replace with actual video tag if needed */}
                <span style={{fontSize: '72px', color: 'white'}}>►</span>
            </div>
        </div>
    </div>
        </>
    );
}

export default ArtistLandingPage;
