import { useEffect} from 'react'
import MediaContextProvider from './contexts/MediaContextProvider.jsx'
import authService from './services/auth'
import { useDispatch } from 'react-redux'
import { login , logout , setLoading } from '../store/authSlice'
import Header from './components/Header/Header'
import { Outlet } from 'react-router-dom'
function App() {
  const dispatch = useDispatch();
 const getUser = async()=>{
    try {
        dispatch(setLoading());
        const res = await authService.getCurrrentUser();
        const userData = res.user;
        if(!userData){
            return null;
        }
        // logged in so now update the status
        dispatch(login(userData));

    } catch {
        dispatch(logout())
    }
   }
    useEffect(()=>{
        getUser();
    } , [])
  return(

    <MediaContextProvider>

      <Outlet/>
    </MediaContextProvider>
  )
}

export default App
