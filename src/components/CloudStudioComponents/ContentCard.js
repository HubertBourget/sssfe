import React from "react";
import styled from "styled-components";



const ContentCard = ({ imageThumbnailUrl, title, artistName }) => {
    return (
        <Card>
        <ImageContainer>
            <img src={imageThumbnailUrl} alt={title} />
        </ImageContainer>
        <TextContainer>
            <Title>{title}</Title>
            <ArtistName>{artistName}</ArtistName>
        </TextContainer>
        </Card>
    );
};

export default ContentCard;

const Card = styled.div`
    flex: 0 0 calc(29.5% - 20px); // Each card takes up 1/3 of the container width minus the gap
    background-color: 'transparent';
    padding-left: 20px;
    padding-top: 80px;
    padding-bottom: 20px;
    margin-bottom: 1vw;
    border-radius: 8px;
    box-sizing: border-box; // Ensure padding and border are included in the width calculation
    cursor: pointer;
`;

const ImageContainer = styled.div`
    img {
        width: 100%;
        height: auto;
    }
`;

const TextContainer = styled.div`
    padding: 15px;
`;

const Title = styled.h2`
    margin: 0;
    padding: 5px 0;
    font-size: 18px;
    color: rgb(67, 66, 137);
`;

const ArtistName = styled.p`
    margin: 0;
    padding:  5px 0;
    font-size: 14px
`