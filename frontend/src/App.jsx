import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Navbar from './components/shared/Navbar'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Home from './components/Home';
import Jobs from './components/Jobs';
import Browse from './components/Browse';
import Profile from './components/Profile';
import Companies from './components/admin/Companies';
import JobDescription from './components/JobDescription';
import CompanyCreate from './components/admin/CompanyCreate';
import CompanySetup from './components/admin/CompanySetup';
import AdminJobs from "./components/admin/AdminJobs"
import PostJob from './components/admin/PostJob';
import Applicants from './components/admin/Applicants'
import ProtectedRoute from './components/admin/ProtectRoute';
// import { Provider } from "react-redux";
// import store from "./redux/store";
const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/signup",
    element: <Signup />
  },
  {
    path: "/jobs",
    element: <Jobs />
  },
  {
    path: "/description/:id",
    element: <JobDescription/>
  },
  {
    path: "/browse",
    element: <Browse />
  },
  {
    path: "/profile",
    element: <Profile />
  },
    // start to define the path for admin 
    {
      path:"/admin/companies",
      element:  <Companies/>
    },
    {
      path:"/admin/companies/create",
      element: <ProtectedRoute><CompanyCreate/></ProtectedRoute> 
    },
    {
      path:"/admin/companies/:id",
      element:<CompanySetup />
    },
    {
      path:"/admin/jobs",
      element:<AdminJobs />
    },
    {
      path:"/admin/jobs/create",
      element:<PostJob/>
    },
    {
      path:"/admin/jobs/:id/applicants",
      element:<Applicants/>
    }
])
function App() {

  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  )
}

export default App 
