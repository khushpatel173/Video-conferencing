
import React , {useRef} from 'react'
import { useState } from 'react';
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
    <>
        {isAudio ? (<i className="fa-solid fa-microphone" onClick={toggleMic}></i>) : (<i className="fa-solid fa-microphone-slash" onClick={toggleMic}></i>)}

        {isVideo ? <i className="fa-solid fa-video" onClick={toggleVideo}></i> : <i className="fa-solid fa-video-slash" onClick={toggleVideo}></i>}

        {/* this will be the video ref */}
        <video
    ref={videoRef}
    autoPlay
    muted
    playsInline
/>
        Enter your Name :<input type="text" placeholder='name' value={name} onChange={(e)=>{setName(e.target.value)}}/>
        <button onClick={()=>{
            navigate(`/room/${roomId}`)
        }}>Join</button>
    </>
  )
}

export default Lobby