import React from 'react';
import styled from 'styled-components';

const NavigationButton = ({ onClick, active, children }) => (
  <Button onClick={onClick} active={active}>
    {children}
  </Button>
);

const Button = styled.button`
  width: 100%;
  height: 11vh;
  margin-bottom: 1vh;
  background-color: transparent;
  color: #434289;
  border-radius: 0px;
  border: none;
  border-right: ${({ active }) => (active ? '10px solid #434289' : 'none')};
  display: flex;
`;

export default NavigationButton;
