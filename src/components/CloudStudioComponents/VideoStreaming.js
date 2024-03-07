import React, { useEffect, useRef } from 'react';v
import ReactPlayer from 'react-player';

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
    <div className='player-wrapper'>
        <ReactPlayer
            url={streamUrl}
            className='react-player'
            playing
            controls
            width='100%'
            height='100%'
        />
    </div>
    );
};

export default VideoStreaming;
