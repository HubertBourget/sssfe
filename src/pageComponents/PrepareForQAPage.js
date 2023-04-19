import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const PrepareForQA = () => {
    const { videoId } = useParams();
    const { user } = useAuth0();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Music video'
    });
    const [formError, setFormError] = useState('');

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevState) => ({
        ...prevState,
        [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
        await axios.post('/api/updateVideoMetaData', {
            videoId: videoId,
            videoOwner: user.name,
            b_isPreparedForReview: true,
            title: formData.title,
            description: formData.description,
            category: formData.category
        });
        console.log('Video metadata updated successfully');
        navigate('/');
        } catch (error) {
        setFormError('An error occurred while updating the video metadata');
        console.error(error);
        }
    };

    return (
        <>
        <h1>Review for QA</h1>
        <form onSubmit={handleSubmit}>
            <div>
            <label htmlFor="title">Title:</label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} required />
            </div>
            <div>
            <label htmlFor="description">Description:</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} required />
            </div>
            <div>
            <label htmlFor="category">Category:</label>
            <select id="category" name="category" value={formData.category} onChange={handleInputChange}>
                <option value="Music video">Music video</option>
                <option value="Integration support">Integration support</option>
                <option value="Live in the studio">Live in the studio</option>
                <option value="Spoken words">Spoken words</option>
                <option value="Meditation music">Meditation music</option>
                <option value="Behind the scenes">Behind the scenes</option>
                <option value="Concert">Concert</option>
            </select>
            </div>
            {formError && <p style={{ color: 'red' }}>{formError}</p>}
            <button type="submit">Submit</button>
        </form>
        </>
    );
};

export default PrepareForQA;
