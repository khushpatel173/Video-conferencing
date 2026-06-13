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
    <header className='app-header'>
      <div className="brand" onClick={()=> navigate("/")}>
        <span className="brand-mark"><i className="fa-solid fa-video"></i></span>
        <span>MeetFlow</span>
      </div>
      <nav className='header-nav' aria-label="Main navigation">
      {/* <p>Login</p>
      <p>Signup</p>
      <p>Home</p>
      <p>Logout</p> */}
      {navItems.map((item , idx)=>(
        item.active ? (
        <button className="nav-link" onClick={()=>{
          navigate(item.slug)
        }} key={idx}>{item.name}</button>
      
      ) : null
      ))}
    {userStatus && <LogoutBtn/>}

      </nav>
    </header>
  )
}

export default Header
