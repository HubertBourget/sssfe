import React, { useRef } from 'react'
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 } from 'uuid';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';
import ProfileCircle from '../../assets/ProfileCircle.png';
import BannerUploadIcon from '../../assets/BannerUploadIcon.png';

const YourChannel= () => { //{user} was in props
    const [bio, setBio] = useState('');
    const [artistLink, setArtistLink] = useState('');
    const [profilePicture, setProfilePicture] = useState(ProfileCircle);
    const [accountName, setAccountName] = useState('');
    const [accountAvailableAlert, setAccountAvailableAlert] = useState('');
    const [initialBio, setInitialBio] = useState('');
    const [initialArtistLink, setInitialArtistLink] = useState('');
    const [accountNameTaken, setAccountNameTaken] = useState(false);
    const fileInputRef = useRef(null);
    const [bannerImage, setBannerImage] = useState('');

    //testing only
    //take this out on production version
    //*Run a Ctrl-F to clear all of them on Prod*
    const user = {
        name: "debug7e@debug.com",
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/getUserProfile/${user.name}`);
                setAccountName(response.data.accountName || '');
                setInitialBio(response.data.bio || '');
                setInitialArtistLink(response.data.artistLink || '');
                setProfilePicture(response.data.profileImageUrl || ProfileCircle);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [user]);

    useEffect(() => {
        const getCheckAccountName = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/getCheckAccountName`,
                {
                    params: {
                    email: user.name,
                    accountName: accountName,
                    },
                }
                );
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

    const handleBioChange = (event) => {
        setBio(event.target.value);
    };

    const handleArtistLinkChange = (event) => {
        setArtistLink(event.target.value);
    };

    const handleProfilePictureChange = (event) => {
        const files = event.target.files;
        const latestFile = files[files.length - 1]; //always select the last file uploaded in the array.
        setProfilePicture(URL.createObjectURL(latestFile));
        uploadProfilePicture(latestFile);
    };

        const handleProfileSubmit = async (event) => {
        event.preventDefault();
        try {
        await axios.post(
            `${process.env.REACT_APP_API_BASE_URL}/api/updateUserProfile`,
            {
                email: user.name,
                accountName: accountName,
                bio: bio || initialBio,
                artistLink: artistLink || initialArtistLink,
            }
        );
        alert('Profile updated successfully');
        } catch (error) {
        console.error(error);
        }
    };

    const uploadProfilePicture = (uploadingPicture) => {
        if (uploadingPicture == null) {
            console.log("profilePicture was null");
            return;
        }
        const fileUploadName = v4();
        const fileRef = ref(storage, `ProfilePictures/${user.name}/${fileUploadName}`);
        const metadata = {
            contentType: 'image/jpeg',
        };

        uploadBytes(fileRef, uploadingPicture, metadata)
            .then(() => {
            getDownloadURL(fileRef)
                .then((url) => {
                postProfileImage(url);
                setProfilePicture(url); // Update the profilePicture state with the new URL
                })
                .catch((error) => {
                console.error(error);
                });
            })
            .catch((error) => {
            console.error(error);
            });
    };

    const uploadBannerPicture = (uploadingPicture) => {
        if (uploadingPicture == null) {
            console.log("profilePicture was null");
            return;
        }
        const fileUploadName = v4();
        const fileRef = ref(storage, `BannerPictures/${user.name}/${fileUploadName}`);
        const metadata = {
            contentType: 'image/jpeg',
        };

        uploadBytes(fileRef, uploadingPicture, metadata)
            .then(() => {
            getDownloadURL(fileRef)
                .then((url) => {
                postBannerImage(url);
                setBannerImage(url);
                })
                .catch((error) => {
                console.error(error);
                });
            })
            .catch((error) => {
            console.error(error);
            });
    };

    const postProfileImage = (url) => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/postProfileImage`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                email: user.name,
                profileImageUrl: url,
            }),
        })
        .then((res) => res.json())
        .then((data) => console.log(data));
    };

    const postBannerImage = (url) => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/postBannerImage`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                email: user.name,
                bannerImageUrl: url,
            }),
        })
        .then((res) => res.json())
        .then((data) => console.log(data));
    }

    const handleBannerImageChange = (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (file) {

        // Update local state with the file for a preview or further processing
        setBannerImage(URL.createObjectURL(file));
        uploadBannerPicture(file)
        // Optional: Initiate the upload process or save the file to be uploaded later
    }
    };

    const triggerBannerFileInput = () => {
    // Check if the file input reference exists and if it has a current property
    if (fileInputRef && fileInputRef.current) {
        // Simulate a click on the hidden file input
        fileInputRef.current.click();
    }
    };


    return (
        <ProfileEditDiv>
        <h1>Channel</h1>
        <BannerUploadInputField onClick={triggerBannerFileInput}>
            <h2>Upload your channel content banner image</h2>
            <BannerUploadStyledIcon src={BannerUploadIcon}></BannerUploadStyledIcon>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleBannerImageChange}
                style={{ display: 'none' }}
                accept="image/*"
            />
        </BannerUploadInputField>

        <Container>
            <div style={{width:'5vw', marginLeft:'5vw',marginRight:'5vw', display:'flex', flexDirection:'column'}}>
{/*                Disabling Image Preview for now to match design on Figma
                <ProfilePicture src={profilePicture} alt="Profile Picture" /> */}
                <ImageUploadStyledLabel>
                    <input
                    type="file"
                    id="profilePictureInput"
                    accept="image/*"
                    onChange={(e) => {
                        handleProfilePictureChange(e);
                    }}
                    />
                    <h3 style={{marginBottom:'0rem'}}>Upload</h3>
                    <h3 style={{marginTop:'0rem'}}>photo</h3>
                    <ProfileUploadStyledIcon src={BannerUploadIcon}></ProfileUploadStyledIcon>
                </ImageUploadStyledLabel>
            </div>
            <div style={{width:'40vw'}}><form onSubmit={handleProfileSubmit} style={{display:"flex", flexDirection:"column"}}>
                <CustomLabel>
                    <h2>Your Name</h2>
                    <ProfileInputField
                        type="text"
                        value={accountName}
                        onChange={(event) => setAccountName(event.target.value)}
                    />
                    <div>{accountAvailableAlert}</div>
                </CustomLabel>
                <CustomLabel>
                <h2>Write a bio for your profile.</h2>
                <BioTextArea value={bio || initialBio} onChange={handleBioChange} />
                </CustomLabel>
                <br />
                <CustomLabel>
                <h2>Add a link to your website.</h2>
                <ProfileInputField
                    type="text"
                    value={artistLink || initialArtistLink}
                    onChange={handleArtistLinkChange}
                />
                </CustomLabel>
                
                <SaveButton type="submit" disabled={accountNameTaken}>
                    <h1 style={{color:"#F5F5F5"}}>Save Changes</h1>
                </SaveButton>
            </form></div>
        </Container>
        
    </ProfileEditDiv>
    )
}
export default YourChannel;

const ProfileEditDiv = styled.div`
    width:94%;
    height:870px;
    display:flex;
    flex-direction:column;
    padding: 3%;
    overflow: hidden;
`;

const ImageUploadStyledLabel = styled.label`
    position: relative;
    overflow: hidden;
    cursor: pointer;
    border-radius: 33px;
    margin-top: 15px;
    padding: 11px;
    margin-bottom: 11px;
    justify-content: center;
    display: flex;
    flex-direction: column;
    align-items: center;
& input[type="file"] {
    position: absolute;
    font-size: 100px;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 0;
    cursor: pointer;
    display: none;
    
}
`;

const CustomLabel = styled.label`
    margin-top: 3%;
`;

const ProfileInputField = styled.input`
    width: 90%;
    border-radius: 33px;
    margin-right: 5%;
    padding-left: 2%;
    padding-right: 2%;
    padding-top: 11px;
    padding-bottom: 11px;
    overflow: hidden;
`;

const BioTextArea = styled.textarea`
    border-radius: 33px;
    width: 90%;
    height: 200px;
    padding: 2%;
    margin-right: 5%;
    border: none;
    resize: none;
    overflow: hidden;
`;

const SaveButton = styled.button`
    border: none;
    color: #F5F5F5;
    background-color: #434289;
    border-radius: 33px;
    padding: 11px;
    display: flex;
    flex-direction: row;
    cursor: pointer;
    width: fit-content;
    margin-top: 3%;
`;

const ProfilePicture = styled.img`
    display: inline-block;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    object-position: center center;
`;

const BannerUploadInputField = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center; 
    cursor: pointer;
`;

const BannerUploadStyledIcon = styled.img`
    max-width: 100px;
    max-height: 100px;
    object-fit: contain;
`;

const Container = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    overflow: hidden;
`;

const ProfileUploadStyledIcon = styled.img`
    width: 30px; /* default width */
    height: 30px; /* default height */
    max-width: 50px;
    max-height: 50px; 
    object-fit: contain;
`;