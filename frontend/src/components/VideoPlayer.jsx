import { useRef } from "react";
import { useEffect } from "react";

function VideoPlayer({ stream }) {

    const videoRef = useRef(null);

    useEffect(() => {

        if(videoRef.current){
            videoRef.current.srcObject =
                stream;
        }

    }, [stream]);

    return (
        <video
            className="remote-video"
            ref={videoRef}
            autoPlay
            playsInline
        />
    );
}

export default VideoPlayer;
