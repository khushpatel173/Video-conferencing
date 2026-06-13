import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import authService from '../services/auth'
import { login , logout } from '../../store/authSlice'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import {Link} from 'react-router-dom'
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
    <div className='container'>
        <p className='txt'>Login</p>
         <input type="text" {...register("username")} className='border-2 username input' placeholder='Username'/>
        <br />
         <input type="password" {...register("password")} className='border-2 password input' placeholder='Password'/>
        <br />
        <button onClick={handleSubmit(onSubmit)} className='border-2 p-1 bg-amber-100 border-r-2 submit-btn'>Login</button>
        
        {/* <p>Dont have an account? <Link to="/signup">Sign Up</Link></p> */}
    </div>
  )
}

export default LoginForm