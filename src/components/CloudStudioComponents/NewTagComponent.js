import React, { useState } from 'react';
import styled from 'styled-components';

function NewTagComponent({ onTagsChange, value }) {
    const [listOfTags, setListOfTags] = useState(value); 

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

const handleTagChoiceClick = (tag) => {
    setListOfTags((prevTag) => {
        const newTags = prevTag ? prevTag + ', ' + tag : tag;
        // Construct an event-like object with the necessary properties
        const simulatedEvent = {
            target: {
                name: 'tags', // Assuming 'tags' is the name of the field in formData
                value: newTags
            }
        };
        onTagsChange(simulatedEvent); // Pass this simulated event to the callback
        return newTags;
    });
};

const handleTextareaChange = (e) => {
        setListOfTags(e.target.value);
        // Create a simulated event object
        const simulatedEvent = {
            target: {
                name: 'tags', // Make sure this matches your formData field name
                value: e.target.value
            }
        };
        onTagsChange(simulatedEvent); // Update the parent component
    };

    return (
        <>
        <Container>
            <TextArea
                rows={4}
                value={listOfTags}
                onChange={handleTextareaChange}
                placeholder='Add Tags to help others find your content.'
            />
            <TagContainer>
            {tagArray.map((tag, index) => (
                <Tag
                    key={index}
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent the click event from propagating
                        handleTagChoiceClick(tag);
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
    justify-content: space-evenly;
`;

const Tag = styled.div`
padding: 5px;
  cursor: pointer;
  border: 1px solid #434289;
  margin: 5px;
  border-radius: 33px;
  margin-left: 3vw;
  margin-right: 0;

  &:hover {
    background-color: #434289;
    color: white;
    border: 1px solid #434289;
  }
`;

const TextArea = styled.textarea`
    margin-left: 3vw;
    border: 1px solid gray;
    width: 100%;
    resize: vertical; 
    color: #434289;
`;
