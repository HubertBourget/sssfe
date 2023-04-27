import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  height: 100vh;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  width: 333px;
  height: 333px;
  border: 1px solid black;
  position: relative; /* added */
`;

const CenteredButton = styled.button`
  width: 200px;
  height: 50px;
  border-radius: 4px;
  background-color: blue;
  color: white;
  font-size: 18px;
  font-weight: bold;
  position: absolute; /* added */
  top: 50%; /* added */
  left: 50%; /* added */
  transform: translate(-50%, -50%); /* added */
`;

const CenteredText = styled.p`
  font-size: 14px;
  color: black;
`;

function MyComponent() {
  return (
    <Container>
      <ContentWrapper>
        <CenteredButton>Click me</CenteredButton>
        <CenteredText>Some text</CenteredText>
      </ContentWrapper>
    </Container>
  );
}

export default MyComponent;
