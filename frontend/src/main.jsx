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

const router = createBrowserRouter([
  {
    path: "/" , 
    element : <App/>,
    children : [
      {
        path : "/" , 
        element : <Home/>
      } , 
       {
        path : "/login" , 
        element : <Login/>
      } , 
       {
        path : "/signup" , 
        element : <SignUp/>
      } , 
       {
        path : "/lobby/:roomId" , 
        element : <Lobby/>
      } , 
       {
        path : "/room/:roomId" , 
        element : <Room/>
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
