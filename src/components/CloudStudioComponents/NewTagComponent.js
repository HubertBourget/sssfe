import React, { useState } from 'react';
import styled from 'styled-components';
import { useEffect } from 'react';

function NewTagComponent({ onTagsChange, value, style }) {
    // Directly use the value as the array of tags
    const [listOfTags, setListOfTags] = useState(value || []);

    const tagArray = [
        "Acapella",
        "Acoustic",
        "Electronic",
        "Ambient",
        "Meditation",
        "Classical", 
        "Spoken Word",
        "Dance",
        "Vocal",
        "Piano",
        "Hang Drum",
        "Guitar",
        "Percussion",
        "Harp",
        "Full Band",
        "DJ",
        "Santo Daime",
        "Rainbow",
        "Alianca",
        "English", 
        "Mantra",
        "Portuguese",
        "Brazilian",
        "Hebrew",
        "Water",
        "Earth",
        "Fire",
        "Air",
        "Oxum",
        "Yemanja",
        "Ayahuasca",
    ];

    useEffect(() => {
        if (Array.isArray(value)) {
            setListOfTags(value);
        } else if (typeof value === 'string') {
            setListOfTags(value.split(',').map(tag => tag.trim()).filter(tag => tag));
        }
    }, [value]);

    const handleTagClick = (tag) => {
    if (!listOfTags.includes(tag)) {
        const updatedTags = [...listOfTags, tag];
        setListOfTags(updatedTags);
        // Simulate an event object with the expected structure
        const simulatedEvent = {
            target: {
                name: 'tags', // Assuming 'tags' is the name of your form field
                value: updatedTags.join(', ') // Join the array into a string
            }
        };
        onTagsChange(simulatedEvent); // Pass the simulated event to the parent component
    }
};

    const handleTextareaChange = (e) => {
        const tags = e.target.value.split(',')
                         .map(tag => tag.trim())
                         .filter(tag => tag); // Split and clean tags, removing empty ones
        setListOfTags(tags);
        onTagsChange(tags); // Pass array to parent
    };


    return (
        <>
        <Container style={style}>
            <TextArea
                row={4}
                value={listOfTags.join(', ')} // Join array for display
                onChange={handleTextareaChange}
                placeholder="Enter tags separated by commas."
            />
            <TagContainer>
            {tagArray.map((tag, index) => (
                <Tag
                    key={index}
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent the click event from propagating
                        handleTagClick(tag);
                    }}
                >
                    {tag}
                </Tag>
            ))}
            </TagContainer>
        </Container>

        </>
    );
}

export default NewTagComponent;

const Container = styled.div`
    display: flex;
    flex-wrap: wrap;
`;

const TagContainer = styled.div`
margin-top: 3vh;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
`;

const Tag = styled.div`
padding: 5px;
    cursor: pointer;
    border: 1px solid #434289;
    margin: 5px;
    border-radius: 33px;
    margin-right: 0;

    &:hover {
        background-color: #434289;
        color: white;
        border: 1px solid #434289;
    }
`;

const TextArea = styled.textarea`
    border: 1px solid gray;
    width: 100%;
    resize: vertical; 
    color: #434289;
    padding: 22px;
`;
