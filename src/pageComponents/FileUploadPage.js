//Preparing this for deletion 4th of Mai


// import React, { useEffect, useState } from 'react';
// import { storage } from '../firebase';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import { v4 } from 'uuid';
// import { useAuth0 } from '@auth0/auth0-react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';

// const FileUploadPage = () => {
//     const [fileUpload, setFileUpload] = useState(null);
//     const [fileList, setFileList] = useState([]);
//     const { user, isAuthenticated } = useAuth0();

//     const postVideoMetaData = (videoId, fileUrl, originalFileName) => {
//         fetch('https://jellyfish-app-tj9ha.ondigitalocean.app/api/postVideoMetaData', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             Accept: 'application/json',
//         },
//         body: JSON.stringify({
//             videoOwner: user.name,
//             videoId: videoId,
//             originalFileName: originalFileName,
//             b_isPreparedForReview: false,
//             b_hasBeenReviewed: false,
//             b_isApproved: false,
//             fileUrl: fileUrl,
//         }),
//         })
//         .then((res) => res.json())
//         .then((data) => console.log(data));
//     };

//     const uploadFile = () => {
//         if (fileUpload == null) {
//         return;
//         }
//         const fileUploadName = v4();
//         const originalFileName = fileUpload.name;
//         const fileRef = ref(storage, `Uploads/${user.name}/${fileUploadName}`);
//         uploadBytes(fileRef, fileUpload).then(() => {
//         getDownloadURL(fileRef).then((url) => {
//             const videoId = fileUploadName;
//             postVideoMetaData(videoId, url, originalFileName);
//             alert('Upload Successful!');
//             setFileUpload(null); // clear the selected file after successful upload
//         });
//         });
//     };

//     useEffect(() => {
//         const fetchVideos = async () => {
//         if (user && user.name) {
//             const response = await axios.get('https://jellyfish-app-tj9ha.ondigitalocean.app/api/getPreReviewedVideoList', {
//             params: {
//                 videoOwner: user.name,
//                 b_isPreparedForReview: false,
//             },
//             });
//             setFileList(response.data);
//         }
//         };
//         fetchVideos();
//     }, [user?.name, fileUpload]); // add fileUpload to the dependency array

//     return (
//         <>
//         {isAuthenticated ? (
//             <div>
//             <input type="file" onChange={(event) => setFileUpload(event.target.files[0])} />
//             <button onClick={uploadFile}>Upload File</button>
//             <Link to="/">
//                 <button>Home</button>
//             </Link>
//             <div>
//                 <h2>Video List</h2>
//                 <ul>
//                 {fileList.map((video) => (
//                     <li key={video._id}>
//                     <h3>{video.VideoMetaData.videoId}</h3>
//                     <p>Owner: {video.VideoMetaData.videoOwner}</p>
//                     <p>File URL: {video.VideoMetaData.fileUrl}</p>
//                     <Link to={`/PrepareForQA/${video.VideoMetaData.videoId}`}>
//                         <button>Review</button>
//                     </Link>
//                     </li>
//                 ))}
//                 </ul>
//             </div>
//             </div>
//         ) : (
//             <div>
//             <p>Please log in to use the Cloud Studio.</p>
//             </div>
//         )}
//         </>
//     );
// };

// export default FileUploadPage;
