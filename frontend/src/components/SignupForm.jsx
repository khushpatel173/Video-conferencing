import {useForm} from 'react-hook-form'
import authService from '../services/auth';
import './LoginForm.css'
function SignupForm() {
    const {register , handleSubmit} = useForm();
    const onSubmit = async(data)=>{
      await authService.signup(data);
    }
  return (
    <div className='auth-card'>
      <div className="auth-heading">
        <p className='eyebrow'>Create account</p>
        <h1 className='auth-title'>Sign up</h1>
      </div>
         <label className="field-label" htmlFor="signup-username">Username</label>
         <input id="signup-username" type="text" {...register("username")} placeholder='Username' className='app-input'/>
         <label className="field-label" htmlFor="signup-email">Email</label>
         <input id="signup-email" type="email" {...register("email")} placeholder='Email' className='app-input'/>
         <label className="field-label" htmlFor="signup-password">Password</label>
         <input id="signup-password" type="password" {...register("password")} placeholder='Password' className='app-input'/>
        <button onClick={handleSubmit(onSubmit)} className='primary-btn wide-btn'>Sign up</button>
    </div>
  )
}

export default SignupForm
