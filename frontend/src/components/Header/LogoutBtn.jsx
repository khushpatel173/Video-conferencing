import authService from '../../services/auth'
import { useDispatch } from 'react-redux';
import { logout } from '../../../store/authSlice';

function LogoutBtn() {
    const dispatch = useDispatch();
    const onLogout = async()=>{
          try {
        const res = await authService.logout();
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
