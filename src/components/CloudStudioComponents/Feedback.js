import React, { useState } from 'react';
import styled from 'styled-components';
import { v4 } from 'uuid';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';

//Leaving Feedback component on ice, it is not finished
//Switching focus on the Upload COmponents for now
const Feedback = ({ user }) => {
    const [subject, setSubject] = useState('');
    const [feedbackType, setFeedbackType] = useState('General Feedback');
    const [message, setMessage] = useState('');
    const [attachment, setAttachment] = useState(null);

    const handleSubjectChange = (event) => {
        setSubject(event.target.value);
    };

    const handleFeedbackTypeChange = (event) => {
        setFeedbackType(event.target.value);
    };

    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    };

    const handleAttachmentChange = (event) => {
        const files = event.target.files;
        const latestFile = files[files.length - 1]; //always select the last file uploaded in the array.
        setAttachment(URL.createObjectURL(latestFile));
        uploadAttachment(latestFile);
    };

    const uploadAttachment = (uploadingPicture) => {
    if (uploadingPicture == null) {
        console.log("profilePicture was null");
        return;
    }
    const fileUploadName = v4();
    const fileRef = ref(storage, `Feedback/${user}/${fileUploadName}`);
    const metadata = {
        contentType: 'image/jpeg',
    };

    uploadBytes(fileRef, uploadingPicture, metadata)
        .then(() => {
        getDownloadURL(fileRef)
            .then((url) => {
            postAttachment(url); //create the endpoint in the BE
            })
            .catch((error) => {
            console.error(error);
            });
        })
        .catch((error) => {
        console.error(error);
        });
};

const postAttachment = (url) => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/postAttachment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ //Maybe improve this part
            email: user,
            Attachment: url,
          }),
        })
          .then((res) => res.json())
          .then((data) => console.log(data));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission logic here
        // You can access subject, feedbackType, message, and attachment state values here
    };

    return (
        <form onSubmit={handleSubmit}>
        <h1>Feedback & Suggestion</h1>

        <label>
            Subject:
            <input type="text" value={subject} onChange={handleSubjectChange} />
        </label>

        <div>
            <label>
            <input
                type="radio"
                value="General Feedback"
                checked={feedbackType === 'General Feedback'}
                onChange={handleFeedbackTypeChange}
            />
            General Feedback
            </label>
            <label>
            <input
                type="radio"
                value="Bug Report"
                checked={feedbackType === 'Bug Report'}
                onChange={handleFeedbackTypeChange}
            />
            Bug Report
            </label>
            <label>
            <input
                type="radio"
                value="Feature Request"
                checked={feedbackType === 'Feature Request'}
                onChange={handleFeedbackTypeChange}
            />
            Feature Request
            </label>
            <label>
            <input
                type="radio"
                value="Other"
                checked={feedbackType === 'Other'}
                onChange={handleFeedbackTypeChange}
            />
            Other
            </label>
        </div>

        <label>
            Message:
            <textarea value={message} onChange={handleMessageChange} />
        </label>

        <div>
            <AttachmentUploadStyledLabel>
                <h2 style={{color: "#434289"}}>+ Add an attachment</h2>
                <input
                    type="file"
                    id="attachmentInput"
                    accept="image/*"
                    onChange={(e) => {
                        handleAttachmentChange(e);
                    }}
                />
            </AttachmentUploadStyledLabel>
            {/* You can add attachment input field or logic here */}
        </div>

        <button type="submit">Submit</button>
        </form>
    );
};

export default Feedback;

const AttachmentUploadStyledLabel = styled.label`
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
