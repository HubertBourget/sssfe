import React from 'react';
import styled from 'styled-components';

const NavigationButton = ({ onClick, active, children }) => (
  <Button onClick={onClick} active={active}>
    {children}
  </Button>
);

const Button = styled.button`
  flex: 1;
  padding: 10px;
  margin-bottom: 10px;
  border: none;
    border-right: ${({ active }) => (active ? '10px solid black' : 'none')};
`;
//${({ active }) => (active ? '#A3C4A338' : '#d3d3d3')};

export default NavigationButton;
