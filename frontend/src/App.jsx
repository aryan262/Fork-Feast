import { Button } from '@/components/ui/button'
import Login from './auth/Login'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import Signup from './auth/Signup'
import ForgotPassword from './auth/ForgotPassword'
import ResetPassword from './auth/ResetPassword'
import VerifyEmail from './auth/VerifyEmail'
import HeroSection from './components/HeroSection'
import MainLayout from './layout/MainLayout'
import Profile from './components/Profile'
import SearchPage from './components/SearchPage'
import RestaurantDetails from './components/RestaurantDetails'
import Cart from './components/Cart'
import Restaurant from './admin/Restaurant'
import AddMenu from './admin/AddMenu'
import Orders from './admin/Orders'
import Success from './components/Success'
import { useUserStore } from './store/useUserStore'
import { useEffect } from 'react'
import Loading from '@/components/Loading'
import { useThemeStore } from './store/useThemeStore'


const ProtectedRoutes = ({children})=>{
  const {isAuthenticated, user, isCheckingAuth} = useUserStore();
  if (isCheckingAuth) {
    return <Loading />;
  }
  if(!isAuthenticated){
    return <Navigate to="/login" replace />
  }
  // if(!isAuthenticated && !user?.isVerified){
  //   return <Navigate to="/" replace />
  // }
  if(!user?.isVerified){
    return <Navigate to="/verifyemail" replace />
  }
  return children
}

const AuthenticatedUser = ({children})=>{
  const {isAuthenticated, user} = useUserStore();
  if(isAuthenticated && user?.isVerified){
    return <Navigate to="/" replace />
  }
  return children
}

const AdminRoute = ({children})=>{
  const {user, isAuthenticated} = useUserStore();
  if(!isAuthenticated){
    return <Navigate to="/login" replace />
  }
  if(!user?.admin){
    return <Navigate to="/" replace />
  }
  return children
}

const appRouter = createBrowserRouter([
  {
    path:"/",
    element:<ProtectedRoutes><MainLayout/></ProtectedRoutes>,
    children:[
      {
        path:"/",
        element:<HeroSection/>
      },
      {
        path:"/profile",
        element:<Profile/>
      },
      {
        path:"/search/:text",
        element:<SearchPage/>
      },
      {
        path:"/restaurant/:id",
        element:<RestaurantDetails/>
      },
      {
        path:"/cart",
        element:<Cart/>
      },
      {
        path:"/order/status",
        element:<Success/>
      },
      {
        path:"/admin/restaurant",
        element:<AdminRoute><Restaurant/></AdminRoute>
      },
      {
        path:"/admin/menu",
        element:<AdminRoute><AddMenu/></AdminRoute>
      },
      {
        path:"/admin/orders",
        element:<AdminRoute><Orders/></AdminRoute>
      },
    ]
  },
  {
    path:"/login",
    element:<AuthenticatedUser><Login/></AuthenticatedUser>
  },
  {
    path:"/signup",
    element:<AuthenticatedUser><Signup/></AuthenticatedUser>
  },
  {
    path:"/forgot",
    element:<AuthenticatedUser><ForgotPassword/></AuthenticatedUser>
  },
  {
    path:"/reset",
    element:<ResetPassword/>
  },
  {
    path:"/verifyemail",
    element:<VerifyEmail/>
  },
])
function App() {
  const {initializeTheme} = useThemeStore()
  const {checkAuthentication, isCheckingAuth} = useUserStore();

  useEffect(()=>{
    checkAuthentication();
    initializeTheme();
  }, [checkAuthentication])

  if(isCheckingAuth){
    return <Loading/>
  }
  return (
    <main>
      <RouterProvider router={appRouter}></RouterProvider>
    </main>
  )
}

export default App
