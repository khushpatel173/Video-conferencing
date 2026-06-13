import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from '../store/store.js'
import { createBrowserRouter  , RouterProvider} from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import Lobby from './pages/Lobby.jsx'
import Room from './pages/Room.jsx'
import Header from './components/Header/Header.jsx'
import AuthLayout from './components/AuthLayout.jsx'

const router = createBrowserRouter([
  {
    path: "/" , 
    element : <App/>,
    children : [
      {
        path : "/" , 
        element : <>
        <Header/>
        <AuthLayout authentication={true}>
        <Home/>
        </AuthLayout>
        </>
        
      } , 
       {
        path : "/login" , 
        element : 
        <>
    <Header/>
       <AuthLayout authentication={false}>
        <Login/>
        </AuthLayout>
        </>
      } , 
       {
        path : "/signup" , 
        element : <>
        <Header/>
       <AuthLayout authentication={false}>
        <SignUp/>
        </AuthLayout>
        </>
      } , 
       {
        path : "/lobby/:roomId" , 
        element : <AuthLayout authentication={true}>
        <Lobby/>
        </AuthLayout>
      } , 
       {
        path : "/room/:roomId" , 
        element : <AuthLayout authentication={true}>
        <Room/>
        </AuthLayout>
      } , 

    ]
  }
])

createRoot(document.getElementById('root')).render(

  <StrictMode>
    <Provider store={store}>
    <RouterProvider router={router}/>
    </Provider>
  </StrictMode>,
)
