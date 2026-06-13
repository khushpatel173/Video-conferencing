// this page should also be accessible if the user is logged in so we will wrap it arounf with the authLayout

import { useState } from 'react'
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
        <main className="page-shell home-page">
        <section className="home-hero" aria-labelledby="home-title">
            <div className="hero-copy">
                <p className="eyebrow">Secure video meetings</p>
                <h1 id="home-title">Start or join a meeting in seconds.</h1>
                <p className="hero-text">A focused space for quick calls, lobby checks, and clear meeting controls.</p>
            </div>

            <div className="meeting-panel">
                <div className="panel-header">
                    <span className="panel-icon"><i className="fa-solid fa-video"></i></span>
                    <div>
                        <p className="panel-kicker">Meeting access</p>
                        <h2>Join a room</h2>
                    </div>
                </div>

                <label className="field-label" htmlFor="meeting-id">Meeting ID</label>
                <div className="join-row">
        <input id="meeting-id" className="app-input" type="text" placeholder='Enter the meeting id' value={meetingId} onChange={(e)=>{
        setMeetingId(e.target.value);
        }}/>
        <button className="primary-btn" onClick={onJoin}  disabled={!meetingId.trim()}>Join</button>
                </div>

                <div className="divider">
                    <span></span>
                    <p>or</p>
                    <span></span>
                </div>

        <button className="secondary-btn wide-btn" onClick={onNewMeeting} disabled={loading}>
            <i className="fa-solid fa-plus"></i>
            {loading ? 'Creating meeting...' : 'Create a new meeting'}
        </button>
            </div>
        </section>
        </main>
  )
}

export default Home
