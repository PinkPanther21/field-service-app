import Login from './pages/Login'
import { Routes, Route, Navigate } from 'react-router-dom'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
 
  return (
  <>
  <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>}/>
      <Route path="/" element={<Navigate to="/login"/>} />
    </Routes> 
  </>
  )
}

export default App
