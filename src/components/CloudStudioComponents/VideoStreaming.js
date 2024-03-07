import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const VideoStreaming = () => {
    const videoRef = useRef();
    
    // Replace YOUR_PLAYBACK_ID with the actual playbackId provided by Mux
    const streamUrl = "https://stream.mux.com/GziSG02lsouwBJQOc029kU52exgSp9l00iGOEEDwLX01bg00.m3u8";

    useEffect(() => {
        const player = videojs(videoRef.current, { fluid: true });
        player.src({
            src: streamUrl,
            type: 'application/x-mpegURL',
        });
        return () => {
            if (player) {
                player.dispose();
            }
        };
    }, [streamUrl]);

    return (
        <div data-vjs-player>
            <video ref={videoRef} className="video-js" controls />
        </div>
    );
};

export default VideoStreaming;
