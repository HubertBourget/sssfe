import React from 'react'
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { v4 } from 'uuid';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import ProfileCircle from '../assets/ProfileCircle.png';

export default function ProfileEditSection() {
    const [uploadType, setUploadType] = useState('');
    const [title, setTitle] = useState('');
    const [fileUpload, setFileUpload] = useState(null);
    const [fileList, setFileList] = useState([]);
    const { user, isAuthenticated } = useAuth0();
    const [bio, setBio] = useState('');
    const [artistLink, setArtistLink] = useState('');
    const [profilePicture, setProfilePicture] = useState(ProfileCircle);
    const [accountName, setAccountName] = useState('');
    const [accountAvailableAlert, setAccountAvailableAlert] = useState('');
    const [previewProfilePicture, setPreviewProfilePicture] = useState(null);
    const [initialBio, setInitialBio] = useState('');
    const [initialArtistLink, setInitialArtistLink] = useState('');
    const [accountNameTaken, setAccountNameTaken] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://jellyfish-app-tj9ha.ondigitalocean.app/api/getUserProfile/${user.name}`);
                setAccountName(response.data.accountName || '');
                setInitialBio(response.data.bio || '');
                setInitialArtistLink(response.data.artistLink || '');
                setProfilePicture(response.data.profileImageUrl || ProfileCircle);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [user?.name]);

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
                    console.log(accountAvailableAlert);
                }
                else {
                    setAccountAvailableAlert(response.data.message);
                    setAccountNameTaken(false);
                    console.log(accountAvailableAlert);
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
        setProfilePicture(latestFile);
        setPreviewProfilePicture(URL.createObjectURL(latestFile));
    };
        const handleProfileSubmit = async (event) => {
        event.preventDefault();
        try {
        await axios.post('https://jellyfish-app-tj9ha.ondigitalocean.app/api/updateUserProfile', {
            email: user.name,
            bio: bio,
            artistLink: artistLink,
        });
        uploadProfilePicture();
        alert('Profile updated successfully');
        } catch (error) {
        console.error(error);
        }
    };

    const uploadProfilePicture = () => {
        if (profilePicture == null) {
            console.log("profilePicture was null")
        return;
        }
        const fileUploadName = v4();
        const fileRef = ref(storage, `ProfilePictures/${user.name}/${fileUploadName}`);
        uploadBytes(fileRef, profilePicture).then(() => {
        getDownloadURL(fileRef).then((url) => {
            postProfileImage(url);
            setProfilePicture(null); // clear the selected file after successful upload
        });
        });
    };

    const postProfileImage = (url) => {
        fetch('https://jellyfish-app-tj9ha.ondigitalocean.app/api/postProfileImage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({
            email: user.name,
            profileImageUrl: url
        }),
        })
        .then((res) => res.json())
        .then((data) => console.log(data));
    };

    return (
        <ProfileEditDiv>
                    <h1>Your Profile</h1>
                    <div style={{display:"flex", flexDirection:"row"}}>
                        <ProfilePicture src={profilePicture} alt="Profile Picture" />
                        <ImageUploadStyledLabel>
                            <h2 style={{color: "#434289"}}>Upload Profile Picture</h2>
                            {uploadType.charAt(0).toUpperCase() + uploadType.slice(1)}
                            <input
                            type="file"
                            id="profilePictureInput"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                const reader = new FileReader();
                                reader.addEventListener("load", () => {
                                    setProfilePicture(reader.result);
                                });
                                reader.readAsDataURL(file);
                                }
                            }}
                            />
                        </ImageUploadStyledLabel>
                    </div>
                    
                    <form onSubmit={handleProfileSubmit} style={{display:"flex", flexDirection:"column"}}>
                        <CustomLabel>
                            <h2>Change your account name.</h2>
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
                    </form>
                </ProfileEditDiv>
    )
}

const ProfileEditDiv = styled.div`
    width:66%;
    height:870px;
    margin:5%;
    display:flex;
    flex-direction:column;
    border-radius: 33px;
    padding: 15px;
    overflow:"hidden"
`;

const ImageUploadStyledLabel = styled.label`
    display: inline-block;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    border-radius: 33px;
    margin-top: 15px;
    padding: 11px;
    margin-bottom: 11px;
    z-index: 0;
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
`;

const BioTextArea = styled.textarea`
    border-radius: 33px;
    width: 90%;
    height: 200px;
    padding: 2%;
    margin-right: 5%;
    border: none;
    resize: none;
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

