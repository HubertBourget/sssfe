import React from 'react';
import styled from "styled-components";
import uploadEditIcon from '../../assets/uploadEditIcon.png';
import uploadHamburgerIcon from '../../assets/uploadHamburgerIcon.png';
import uploadTrashIcon from '../../assets/uploadTrashIcon.png';

const FileProgressBar = ({ file, progress, onDelete  }) => {
    return (
        <FileUploadStatus>
            <ProgressIndicator progress={progress} />
            <FileName>{file.name}</FileName>
                <img src={uploadHamburgerIcon} alt="" />
                <img src={uploadTrashIcon} alt="" style={{marginRight:'25px', zIndex:'21', cursor: 'pointer'}} onClick={onDelete}/>
        </FileUploadStatus>
    );
};

const FileUploadStatus = styled.div`
    margin-top: 10px;
    position: relative; // Needed for absolute positioning of children
    padding-top: 5px; // Space for the progress bar at the top
    background-color: #F5F5F5;
    padding: 22px;
    border: 1px solid #D9D9D9;
    display: flex;
    justify-content: space-between;
`;

const ProgressIndicator = styled.div`
    background-color: #434289; // Blue color for the progress bar color:
    width: ${props => props.progress}%;
    height: 6px; // Thin line for the progress bar
    transition: width 0.4s ease;
    position: absolute; // Align with the top of FileUploadStatus
    top: 0;
    left: 0;
`;

const FileName = styled.span`
    position: absolute; // Normal flow, below the progress bar
    color: #333; // Text color, change as needed
    font-size: 20px; // Adjust as per your design
    display: flex;
    justify-content: center;
    left: 45%;
`;

export default FileProgressBar;
