import React from "react";
import styled from "styled-components";
import BackImg from "../../assets/back.svg";
import { useNavigate } from "react-router-dom";
export default function BackButton() {
  const navigate = useNavigate();
  return (
    <BackIcon onClick={() => navigate(-1)}>
      <img src={BackImg} alt="not loaded" ></img>
    </BackIcon>
  );
}

const BackIcon = styled.div`
  position: absolute;
  z-index: 9;
  padding: 15px;
  margin: 30px 10px 10px;
  cursor: pointer;
  @media (max-width: 991px) {
    top: 20px;
  }
`;
