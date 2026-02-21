import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Pacientes from './pages/Pacientes'
import Especialidades from './pages/Especialidades'
import Citas from './pages/Citas'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard"      element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/pacientes"      element={<PrivateRoute><Pacientes /></PrivateRoute>} />
        <Route path="/especialidades" element={<PrivateRoute><Especialidades /></PrivateRoute>} />
        <Route path="/citas"          element={<PrivateRoute><Citas /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
