import { useState  , useEffect} from 'react'
import SignupForm from './components/SignupForm'
import MediaContextProvider from './contexts/MediaContextProvider.jsx'
import LoginForm from './components/LoginForm'
import authService from './services/auth'
import { useDispatch } from 'react-redux'
import { login , logout } from '../store/authSlice'
import { useSelector } from 'react-redux'
import LogoutBtn from './components/Header/LogoutBtn'
import Header from './components/Header/Header'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Home from './pages/Home'
import Lobby from './pages/Lobby'
import Room from './pages/Room.jsx'
import { Outlet } from 'react-router-dom'
function App() {
  const dispatch = useDispatch();
   const userStatus = useSelector((state)=> state.auth.status);
 const getUser = async()=>{
    try {
        const res = await authService.getCurrrentUser();
        const userData = res.user;
        if(!userData){
            return null;
        }
        // logged in so now update the status
        dispatch(login(userData));

    } catch (error) {
        dispatch(logout())
    }
   }
    useEffect(()=>{
        getUser();
    } , [])
  return(

    <MediaContextProvider>
      <Header/>
      <Outlet/>
    </MediaContextProvider>
  )
}

export default App
