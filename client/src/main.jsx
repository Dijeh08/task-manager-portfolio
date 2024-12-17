import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import MainPage from './pages/MainPage.jsx';
import ErrorPage from './pages/error-page.jsx'
import Authentication from './pages/authenticationPage.jsx';
import Registration from './pages/registrationPage.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';
import { BackgroundProvider } from './pages/BackgroundContext.jsx';
import { green } from '@mui/material/colors';


const router = createBrowserRouter([
  {
    path: '/task-manager-portfolio/',
    element: <Authentication />,
    errorElement: <ErrorPage />
  },
  {
    path: '/task-manager-portfolio/user',
    element: <MainPage />,
    errorElement: <ErrorPage />
  },
  {
    path: '/task-manager-portfolio/registrationPage',
    element: <Registration />,
    errorElement: <ErrorPage />
  },
]);

createRoot(document.getElementById('root')).render(
  
  <BackgroundProvider>
    <GoogleOAuthProvider clientId= {import.meta.env.VITE_SECRET_CLIENT_ID}>
    <div style={{ backgroundColor: green, minHeight: '100vh' }}>
      <RouterProvider router={router}/>
    </div> 
    </GoogleOAuthProvider>,
  </BackgroundProvider>
)