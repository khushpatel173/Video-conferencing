import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import './Header.css'
import LogoutBtn from './LogoutBtn';
function Header() {
  const navigate = useNavigate();
  const userStatus = useSelector((state)=> state.auth.status);
           const navItems = [
    {
      name: 'Home',
      slug: "/",
      active: true
    }, 
    {
      name: "Login",
      slug: "/login",
      active: !userStatus,
  },
  {
      name: "Signup",
      slug: "/signup",
      active: !userStatus,
  },
  ]
  return (
    <>
      <div className='container'>
      {/* <p>Login</p>
      <p>Signup</p>
      <p>Home</p>
      <p>Logout</p> */}
      {navItems.map((item , idx)=>(
        item.active ? (
        <p onClick={()=>{
          navigate(item.slug)
        }} key={idx}>{item.name}</p>
      
      ) : null
      ))}
    {userStatus && <LogoutBtn/>}

      </div>
    </>
  )
}

export default Header