import { Outlet, Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePgae'
import NotFoundPage from '~/pages/404Page'
import Auth from './pages/Auth/Auth'
import JobDetail from './pages/JobDetail'
import CompanyProfile from './pages/CompanyProfile'
import JobApplication from './pages/ApplyJob'
import JobSeeker from './pages/JobSeeker'
import { useSelector } from "react-redux"
import { selectCurrentEmployer } from './redux/employer/employerSlice'
import Boards from '~/pages/EmployerPages/index'
import { AccountVerification } from './components/AccountVerification/AccountVerification'
import FindJobPage from './components/HomePages/JobSearch/findJobPage'
const ProtectedRoute = ({ employer }) => {
  if (!employer)
    return <Navigate to='employer/login' replace />
  return <Outlet />
}

const UnauthorizedRoute = ({ employer }) => {
  if (employer) {
    return <Navigate to='/employer' replace />
  }
  return <Outlet /> // Bắt buộc phải có để hiển thị nested routes
}

function App() {
  const currentEmployer = useSelector(selectCurrentEmployer)

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/applyJob" element={<JobApplication />} />
      <Route path="/companyProfile" element={<CompanyProfile />} />
      <Route path="/seeker/:section" element={<JobSeeker />} />
      <Route path="/seeker" element={<Navigate to="/seeker/dashboard" replace />} />
      <Route path="/jobDetail" element={<JobDetail />} />
      <Route path="/findJob" element={<FindJobPage />} />

      <Route element={<ProtectedRoute employer={currentEmployer} />}>
        <Route path="/employer" element={<Boards />} />
      </Route>

      <Route  element={<UnauthorizedRoute employer={currentEmployer} />}>
        <Route path="/employer/login" element={<Auth />} />
        <Route path="/employer/register" element={<Auth />} />
        <Route path="/employer/account/verification" element={<AccountVerification />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
