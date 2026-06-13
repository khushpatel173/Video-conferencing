import React from 'react'
import {useForm} from 'react-hook-form'
import authService from '../services/auth';
import './LoginForm.css'
function SignupForm() {
    const {register , handleSubmit} = useForm();
    const onSubmit = async(data)=>{
      const res =  await authService.signup(data);
    }
  return (
    <div className='container'>
      <p className='txt'>SignUp</p>
         <input type="text" {...register("username")} placeholder='username' className='input'/>
        <br />
         <input type="email" {...register("email")} placeholder='Email' className='input'/>
        <br />
         <input type="password" {...register("password")} placeholder='password' className='input'/>
        <br />
        <button onClick={handleSubmit(onSubmit)} className='submit-btn'>Sign up</button>
    </div>
  )
}

export default SignupForm