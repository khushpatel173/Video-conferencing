import authService from '../../services/auth'
import { useDispatch } from 'react-redux';
import { logout } from '../../../store/authSlice';
import socket from '../../services/socket';

function LogoutBtn() {
    const dispatch = useDispatch();
    const onLogout = async()=>{
          try {
        const res = await authService.logout();
        socket.disconnect();
        if (res) {
            dispatch(logout());
        }
    } catch (error) {
        console.log(error);
    }
    }
  return (
    <button className="nav-link danger-link" onClick={onLogout}>Logout</button>
  )
}

export default LogoutBtn
