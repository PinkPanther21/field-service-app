import Login from './pages/Login'
import { Routes, Route, Navigate } from 'react-router-dom'
import Register from './pages/Register'

function App() {
 
  return (
  <>
  <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Navigate to="/register"/>} />
    </Routes> 
  </>
  )
}

export default App
