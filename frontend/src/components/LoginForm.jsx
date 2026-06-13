import { useForm } from 'react-hook-form'
import authService from '../services/auth'
import { login } from '../../store/authSlice'
import { useDispatch } from 'react-redux';
import './LoginForm.css'
function LoginForm() {
    const dispatch = useDispatch();
    const onSubmit = async(data)=>{
        const res = await authService.login(data);
       if(!res.user){
        console.log("Error loggin in");
        return null;
       }
       dispatch(login(res.user));
    }
  
    const {register , handleSubmit} = useForm();
   
   return (
    <div className='auth-card'>
        <div className="auth-heading">
            <p className='eyebrow'>Welcome back</p>
            <h1 className='auth-title'>Login</h1>
        </div>
         <label className="field-label" htmlFor="login-username">Username</label>
         <input id="login-username" type="text" {...register("username")} className='app-input' placeholder='Username'/>
         <label className="field-label" htmlFor="login-password">Password</label>
         <input id="login-password" type="password" {...register("password")} className='app-input' placeholder='Password'/>
        <button onClick={handleSubmit(onSubmit)} className='primary-btn wide-btn'>Login</button>
        
        {/* <p>Dont have an account? <Link to="/signup">Sign Up</Link></p> */}
    </div>
  )
}

export default LoginForm
