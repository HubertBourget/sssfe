import React from 'react';
import styled from 'styled-components';

const FileProgressBar = ({ file, progress }) => {
    return (
        <FileUploadStatus>
            <p>{file.name}</p>
            <ProgressBar progress={progress} />
        </FileUploadStatus>
    );
};

const FileUploadStatus = styled.div`
    margin-top: 10px;
`;

const ProgressBar = styled.div`
    width: 100%;
    background-color: #ddd;
    border-radius: 4px;
    overflow: hidden;

    &::after {
        content: '';
        display: block;
        background-color: #4caf50;
        width: ${props => props.progress}%;
        height: 20px;
        transition: width 0.4s ease;
    }
`;

export default FileProgressBar;
