import React from 'react';
import logo from '../assets/HorozontalLogoWhiteFont.png';
import { useAuth0 } from '@auth0/auth0-react';
import ExplainerVideo from '../assets/SacredSoundExplainerVideo.mp4';
import styled from 'styled-components';
import userGroup from '../assets/userGroup.png';
import musicNote from '../assets/musicNote.png';
import heart from '../assets/heart.png'
import FAQContainer from '../components/CloudStudioComponents/FAQContainer';

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

    const buttonStyle = {
    padding: '30px 60px',
    backgroundColor: '#434289',
    color: 'white',
    border: 'none',
    borderRadius: '0px',
    cursor: 'pointer',
    marginBottom: '7.77vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
};

    const leftColumnStyle = {
        backgroundColor: '#A3C4A3',
        width: '50%',
        boxSizing: 'border-box',
        height:'63vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingLeft: '10%',
        paddingRight: '10%',
        marginLeft: '4vw'
    };

    const rightColumnStyle = {
        width: '50%',
        padding: '4vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        boxSizing: 'border-box',
        backgroundColor: 'transparent',
        height: '60vh'
    };

    const secondSectionStyle = {
        display: 'flex',
        padding: '4vw',
        boxShadow: 'rgb(0 0 0 / 20%) 0px 2px 2px 0px',
        marginBottom: '2px', // Add a small margin to reveal the shadow
        backgroundColor: 'rgb(255,255,255)'
    };

    
    const thirdSectionStyle = {
        display: 'flex',
        height: '60vh', // Ensure this section is also at least the height of the viewport
        backgroundColor: '#f8f8f8', // Replace with your desired background color
        padding: '4vw',
        alignItems:'center',
        boxShadow: 'rgb(0 0 0 / 20%) 0px 2px 2px 0px', 
    };

    const leftTextStyle = {
        width: '50%', // Half the width of the container
        padding: '4vw',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: 'rgb(255,255,255)'
    };

    const rightVideoStyle = {
        width: '50%', // Make sure the video fills the width, // Make sure the video fills the height
        overflow: 'hidden', // Hide any overflow
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(255,255,255)'
    };

    const fourthSectionStyle = {
        display: 'flex',
        flexDirection: 'column',
        height: '60vh',
        backgroundColor: '#f8f8f8',
        boxShadow: 'rgb(0 0 0 / 20%) 0px 2px 2px 0px', 
    };

    const ctaButtonStyle = {
        padding: '10px 20px',
        backgroundColor: '#434289',
        color: 'white',
        border: 'none',
        borderRadius: '0px',
        cursor: 'pointer',
        fontSize: '1.4em',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        outline: 'none',
        minWidth: '30vw'
    };

    return (
        <>
        {/* First section */}
        <SectionDiv>
            <TintedOverlay/>
            <div style={contentStyle}>
            <img src={logo} alt="Logo" style={logoStyle} />
            <div style={{color: 'white',width: '100%', backgroundColor:'transparent'}}>
                <h1 style={{ color: 'white',  fontSize:'4rem', marginBottom:'3vh', marginLeft:'8vw'}}>
                Join the Collective
                </h1>
                <h2 style={{fontSize:'1.9rem', color:'white', marginBottom:'6vh', marginLeft:'8vw'}}>
                    Connect intimately with listeners that go deep
                </h2>
                <div style={{display:'flex', backgroundColor:'transparent', marginLeft:'8vw', marginBottom:'10vh'}}>
                <button style={buttonStyle} onClick={() =>
                    loginWithRedirect({
                    redirectUri: process.env.REACT_APP_REDIRECTURL, //this for staging : https://staging.sacredsound.pages.dev/studio 
                    })
                }>
                    <p style={{ color: 'white', fontSize:'1.4rem'}}>GET STARTED</p>
                </button>
                </div>
            </div>
            </div>
        </SectionDiv>

        {/* Second section */}
        <div style={secondSectionStyle}>
            <div style={leftTextStyle}>
                <h2 style={{fontSize:'3.3rem'}}>A platform designed for your journey as a sacred music artist.</h2>
                <p style={{fontSize:'1.9rem'}}>We pay artists directly and provide professional support to enhance the value of what you create.</p>
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

        {/* Third section */}
        <div style={thirdSectionStyle}>
            <div style={leftColumnStyle}>
            <h1 style={{fontSize:'3.3rem', color:'white'}}>
                Welcome to Your <br/> <ItalicText>Cloud Studio</ItalicText>
            </h1>
            <h2 style={{color:'white', fontSize:'1.8rem'}}>A Platform for Artists to Share Sacred Music and Connect with a Global Community.</h2>
            </div>
            <div style={rightColumnStyle}>
            <h2 style={{fontSize:'2.22rem'}}>Expand through more intimate connection.</h2>
            <p style={{fontSize:'1.5rem'}}>Invite your listeners along deeper into your creative process through video lessons, events, behind the scenes, and more!</p>
            <h2 style={{fontSize:'2.22rem'}}>Earn professional studio support through your music.</h2>
            <p style={{fontSize:'1.5rem'}}>Gain tokens, ‘thanks coins,’ directly from listeners as they gain inspiration, which you can redeem for studio services.</p>
            <h2 style={{fontSize:'2.22rem'}}>Create new revenue streams with your content.</h2>
            <p style={{fontSize:'1.5rem'}}>Upload your magic into our sacred music library, and get paid for every minute of content that gets viewed.</p>
            </div>
        </div>
        
    {/* Fourth section */}
        <div style={fourthSectionStyle}>
            <h2 style={{color: '#434289', fontSize: '3.3em', marginLeft: '8vw', marginBottom:'0vh'}}>Let’s Create Magic Together</h2>
            <p style={{fontSize:'1.5rem', marginLeft: '8vw', marginBottom:'6vh'}}>Share sacred music and receive support from listeners you inspire.</p>
            <div style={{display:'flex', justifyContent: 'space-around',marginLeft: '8vw', marginRight: '3vw', marginBottom: '6vh', backgroundColor:'transparent'}}>
                <div style={{display:'flex', flexDirection:'column', backgroundColor:'transparent', width: '32vw'}}>
                    <img src={userGroup} alt="userGroup" style={{width:'4vw'}}/>
                    <h2 style={{fontSize: '2rem', marginBottom: '0vh'}}>Join the Artist Collective</h2>
                    <p style={{fontSize:'1.5rem'}}>Be one of up to 100 artists selected to join the Sacred Sound Artist Collective.</p>
                </div>
                <div style={{display:'flex', flexDirection:'column', backgroundColor:'transparent', width: '32vw'}}>
                    <img src={musicNote} alt="musicNote" style={{width:'4vw'}}/>
                    <h2 style={{fontSize: '2rem', marginBottom: '0vh'}}>Publish Your Magic</h2>
                    <p style={{fontSize:'1.5rem'}}>Reach the right audience for you and get paid for every minute of content that gets viewed.</p>
                </div>
                <div style={{display:'flex', flexDirection:'column', backgroundColor:'transparent', width: '32vw'}}>
                    <img src={heart} alt="heart" style={{width:'4vw'}}/>
                    <h2 style={{fontSize: '2rem', marginBottom: '0vh'}}>Get Support</h2>
                    <p style={{fontSize:'1.5rem'}}>Unlock studio time and services to continue enhancing the potency of every item that you publish.</p>
                </div>
            </div>
            <div style={{display:'flex', justifyContent:'center', backgroundColor:'transparent'}}>
            <button style={ctaButtonStyle} onClick={() =>
                    loginWithRedirect({
                    redirectUri: process.env.REACT_APP_REDIRECTURL,  
                    })
                }>
                Get Started
            </button>
            </div>

            {/* FAQ section */}
            <div style={{height: 'auto', paddingLeft: '8vw'}}>
                <h2 style={{color: '#434289', fontSize: '3.3em', marginBottom:'1rem', marginBottom:'4vh'}}>FAQ</h2>
                <FAQContainer/>
            </div>
        </div>
        </>
    );
}

export default ArtistLandingPage;

const SectionDiv = styled.div`
    position: relative;
    height:77vh;
    background-image: url('https://firebasestorage.googleapis.com/v0/b/staging-sacred-sound-f472b.appspot.com/o/Assets%2FArtistLandingPageBackgroundImage.png?alt=media&token=6896cce6-8c4a-44f3-91e6-7ef2fc2f51a7');
    background-size: cover;
    background-position: center;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    overflow: hidden;
`;

const TintedOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1;
`;

const ItalicText = styled.span`
    font-style: italic;
    font-size: 3.3rem;
    color: white;
    letter-spacing: -3.33px;
`;