import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Authenticate from './components/Routes/Authenticate.tsx'
import { globals } from './config/globals.ts'
import Restrict from './components/Routes/Restricted.tsx'
import Login from './pages/Login.tsx'
import Friends from './pages/Friends.tsx'
import Register from './pages/Register.tsx'
import Feed from './pages/Feed.tsx'
import { io } from 'socket.io-client'
const socket = io(globals.BACKEND_BASE_URL)

async function getIsLoggedIn() {
  return JSON.parse(localStorage.getItem("isLoggedIn") || "false")
}

const router = createBrowserRouter([
  {
    path: globals.FE_ENDPOINTS.LOGIN,
    element: <Restrict component={<Login />} />,
    loader: getIsLoggedIn
  },
  {
    path: globals.FE_ENDPOINTS.REGISTER,
    element: <Restrict component={<Register />} />,
    loader: getIsLoggedIn
  },
  {
    path: "/",
    element: <App />,
    loader: async () => {
      return JSON.parse(localStorage.getItem("isLoggedIn") || "false")
    },
    children: [
      {
        index: true,
        element: <Authenticate component={<Feed socket={socket} />} />,
        loader: getIsLoggedIn
      },
      {
        path: globals.FE_ENDPOINTS.FRIENDS,
        element: <Authenticate component={<Friends socket={socket} />} />,
        loader: getIsLoggedIn
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
