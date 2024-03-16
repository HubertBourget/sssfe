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
    max-width: 300px;
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    background-color: #fff;
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
    color: #333;
`;

const ArtistName = styled.p`
    margin: 0;
    padding:  5px 0;
    font-size: 14px
`