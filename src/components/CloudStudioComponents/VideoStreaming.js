import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const VideoStreaming = () => {
    const videoRef = useRef();
    
    // Replace YOUR_PLAYBACK_ID with the actual playbackId provided by Mux
    const streamUrl = "https://stream.mux.com/RVWRe01pJejwTUnAQ4YftfCNHQnP9f700fc2LNGIZon7o.m3u8";

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
