import { useForm } from 'react-hook-form'
import authService from '../services/auth'
import { login } from '../../store/authSlice'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css'
import { useState } from 'react';
function LoginForm() {
    const dispatch = useDispatch();
    const [message , setMessage] = useState('');
    const navigate = useNavigate();
    const onSubmit = async(data)=>{
        try {
            setMessage("");
        const res = await authService.login(data);
       dispatch(login(res.user));
       navigate('/');
        } catch(error) {
        setMessage(
        error.response?.data?.message ||
        "Something went wrong"
    );
}
       
    }
  
    const {register , handleSubmit} = useForm();
   
   return (
    <div className='auth-card'>
        <div className="auth-heading">
        <p>{message}</p>
            <p className='eyebrow'>Welcome back</p>
            <h1 className='auth-title'>Login</h1>
        </div>
         <label className="field-label" htmlFor="login-username">Username</label>
         <input id="login-username" type="text" {...register("username")} className='app-input' placeholder='Username' required/>
         <label className="field-label" htmlFor="login-password">Password</label>
         <input id="login-password" type="password" {...register("password")} className='app-input' placeholder='Password' required/>
        <button onClick={handleSubmit(onSubmit)} className='primary-btn wide-btn'>Login</button>
        
        {/* <p>Dont have an account? <Link to="/signup">Sign Up</Link></p> */}
    </div>
  )
}

export default LoginForm
