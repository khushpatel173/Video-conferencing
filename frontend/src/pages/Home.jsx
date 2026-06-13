// this page should also be accessible if the user is logged in so we will wrap it arounf with the authLayout

import React, { useState } from 'react'
import authService from '../services/auth';
import { useNavigate } from 'react-router-dom';

function Home() {
    const [meetingId , setMeetingId] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const onJoin = ()=>{
       if (!meetingId.trim()) {
        return;
    }
            // directly take on the lobby page with the link
        navigate(`/lobby/${meetingId}`);
    }
   const onNewMeeting = async () => {
    try {
        setLoading(true);

        const res = await authService.generateId();
        const roomId = res.roomId;
        navigate(`/lobby/${roomId}`);

    } catch (error) {
        console.log(error);
    } finally {
        setLoading(false);
    }
};
  return (
        <>
        MeetingId : <input type="text" placeholder='Enter the meeting id' value={meetingId} onChange={(e)=>{
        setMeetingId(e.target.value);
        }}/>
        <br />
        <button onClick={onJoin}  disabled={!meetingId.trim()}>Join</button>
        <br />
        <button onClick={onNewMeeting} disabled={loading}>Create a new meeeting</button>
        </>
  )
}

export default Home