import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { storage } from '../firebase';
import { v4 } from 'uuid';
import { useAuth0 } from '@auth0/auth0-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';


export default function EditProfilePage() {
    const { userId } = useParams();
    const [bio, setBio] = useState('');
    const [artistLink, setArtistLink] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [previewProfilePicture, setPreviewProfilePicture] = useState(null);
    const [initialBio, setInitialBio] = useState('');
    const [initialArtistLink, setInitialArtistLink] = useState('');
    const { user, isAuthenticated } = useAuth0();
    const [accountName, setAccountName] = useState('');
    const [accountAvailableAlert, setAccountAvailableAlert] = useState('');
    const [accountNameTaken, setAccountNameTaken] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/getUserProfile/${userId}`);
                setInitialBio(response.data.bio || '');
                setInitialArtistLink(response.data.artistLink || '');
                setPreviewProfilePicture(response.data.profileImageUrl || '');
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [userId]);

    useEffect(() => {
        const checkAccountName = async () => {
            try {
                const response = await axios.get(`/api/checkAccountName/${accountName}`);
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
            checkAccountName();
        }
    }, [accountName]);


        const uploadFile = () => {
        if (profilePicture == null) {
            console.log("profilePicture was null")
        return;
        }
        const fileUploadName = v4();
        const fileRef = ref(storage, `ProfilePictures/${user.name}/${fileUploadName}`);
        uploadBytes(fileRef, profilePicture).then(() => {
        getDownloadURL(fileRef).then((url) => {
            postProfileImage(url);
            alert('Upload Successful!');
            setProfilePicture(null); // clear the selected file after successful upload
        });
        });
    };

    //change this to update user profile with image URL.
    const postProfileImage = (url) => {
        fetch('/api/postProfileImage', {
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

    const handleBioChange = (event) => {
        setBio(event.target.value);
    };

    const handleArtistLinkChange = (event) => {
        setArtistLink(event.target.value);
    };

    const handleProfilePictureChange = (event) => {
        setProfilePicture(event.target.files[0]);
        setPreviewProfilePicture(URL.createObjectURL(event.target.files[0]));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
        await axios.post('/api/updateUserProfile', {
            email: userId,
            bio: bio,
            artistLink: artistLink,
        });
        alert('Profile updated successfully');
        } catch (error) {
        console.error(error);
        }
    };

    return (
    <div>
        {!isAuthenticated && (
        <div>
            <p>Please log in to edit your profile.</p>
        </div>
        )}
        {isAuthenticated && (
        <form onSubmit={handleSubmit}>
            <label>
                Account Name:
                <input
                    type="text"
                    value={accountName}
                    onChange={(event) => setAccountName(event.target.value)}
                />
                Available: {accountAvailableAlert}
            </label>
            <label>
            Bio:
            <textarea value={bio || initialBio} onChange={handleBioChange} />
            </label>
            <br />
            <label>
            Artist Link:
            <input
                type="text"
                value={artistLink || initialArtistLink}
                onChange={handleArtistLinkChange}
            />
            </label>
            <br />
            <label>
            Profile Picture:
            <input type="file" onChange={handleProfilePictureChange} />
            </label>
            <button type="button" onClick={uploadFile}>
            Upload Profile Picture
            </button>
            {previewProfilePicture && (
            <img
                src={previewProfilePicture}
                alt="Preview Profile Picture"
                style={{ width: '200px' }}
            />
            )}
            <br />
            <button type="submit" disabled={accountNameTaken}>
                Save Changes
            </button>
        </form>
        )}
    </div>
);

}
