
import {useRef} from 'react'
import { useEffect } from 'react';
import { useParams } from 'react-router-dom'
import { useContext } from 'react';
import MediaContext from '../contexts/MediaContext';
import { useNavigate } from 'react-router-dom';
function Lobby() {
    const {roomId} = useParams(); 
    console.log(roomId);
  const {isAudio , isVideo , stream , setStream , setIsAudio , setIsVideo , name , setName} = useContext(MediaContext);
    const videoRef = useRef(null);
    const navigate = useNavigate();
    useEffect(()=>{
       async function getMedia() {
  try {

        const mediastream =
            await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });

        setStream(mediastream);

        if(videoRef.current){
    videoRef.current.srcObject = mediastream;
}

        setIsVideo(
            mediastream.getVideoTracks()[0].enabled
        );

        setIsAudio(
            mediastream.getAudioTracks()[0].enabled
        );

    } catch(error) {

        console.log(error);

    }
    
    }   
    getMedia();
    } , []);
    const toggleMic = ()=>{
         if (!stream) return;
        if(stream.getAudioTracks()[0].enabled){
            // then turn it off
            setIsAudio(false);
            stream.getAudioTracks()[0].enabled = false;
        }
        else{
            setIsAudio(true);
            stream.getAudioTracks()[0].enabled = true;
        }
    }
       const toggleVideo = ()=>{
         if (!stream) return;
        if(stream.getVideoTracks()[0].enabled){
            // then turn it off
            setIsVideo(false);
            stream.getVideoTracks()[0].enabled = false;
        }
        else{
            setIsVideo(true);
            stream.getVideoTracks()[0].enabled = true;
        }
    }
  return (
    <main className="page-shell lobby-page">
        <section className="lobby-layout">
            <div className="preview-card">
                <div className="video-stage">
                    {/* this will be the video ref */}
                    <video
    ref={videoRef}
    autoPlay
    muted
    playsInline
/>
                    {!isVideo && <div className="camera-off">Camera off</div>}
                </div>

                <div className="call-controls">
                    <button className={`control-btn ${!isAudio ? 'is-off' : ''}`} onClick={toggleMic} aria-label={isAudio ? 'Mute microphone' : 'Unmute microphone'}>
        {isAudio ? (<i className="fa-solid fa-microphone"></i>) : (<i className="fa-solid fa-microphone-slash"></i>)}
                    </button>

                    <button className={`control-btn ${!isVideo ? 'is-off' : ''}`} onClick={toggleVideo} aria-label={isVideo ? 'Turn camera off' : 'Turn camera on'}>
        {isVideo ? <i className="fa-solid fa-video"></i> : <i className="fa-solid fa-video-slash"></i>}
                    </button>
                </div>
            </div>

            <div className="lobby-panel">
                <p className="eyebrow">Ready room</p>
                <h1>Check your setup before joining.</h1>
                <p className="hero-text">Room ID: <span>{roomId}</span></p>

                <label className="field-label" htmlFor="display-name">Display name</label>
        <input id="display-name" className="app-input" type="text" placeholder='Your name' value={name} onChange={(e)=>{setName(e.target.value)}}/>
        <button className="primary-btn wide-btn" onClick={()=>{
            navigate(`/room/${roomId}`)
        }}>Join meeting</button>
            </div>
        </section>
    </main>
  )
}

export default Lobby
