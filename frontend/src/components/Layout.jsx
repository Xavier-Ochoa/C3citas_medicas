import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const nav = [
  { to: '/dashboard',     label: 'Dashboard',      icon: '⊞' },
  { to: '/pacientes',     label: 'Pacientes',      icon: '🧑‍⚕️' },
  { to: '/especialidades', label: 'Especialidades', icon: '🩺' },
  { to: '/citas',         label: 'Citas',           icon: '📅' },
]

export default function Layout({ children }) {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  const handleLogout = () => { logout(); navigate('/') }

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-64 flex-shrink-0 bg-ink-800 border-r border-ink-600/50 flex flex-col">
        <div className="p-6 border-b border-ink-600/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-med-500 flex items-center justify-center text-lg shadow-lg shadow-med-500/30">🏥</div>
            <div>
              <p className="font-display font-bold text-white text-sm leading-none">CitasMed</p>
              <p className="text-ink-300 text-xs mt-0.5">Gestión de Citas Médicas</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {nav.map(({ to, label, icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive ? 'bg-med-500/15 text-med-400 border border-med-500/20' : 'text-ink-300 hover:text-slate-200 hover:bg-ink-700/60'
              }`
            }>
              <span className="text-base">{icon}</span>{label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-ink-600/50">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 rounded-full bg-med-500/20 border border-med-500/30 flex items-center justify-center text-med-400 text-xs font-bold">
              {usuario?.nombre?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-slate-200 text-xs font-semibold truncate">{usuario?.nombre} {usuario?.apellido}</p>
              <p className="text-ink-300 text-xs truncate">{usuario?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20">
            <span>↩</span> Cerrar sesión
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto bg-ink-900">{children}</main>
    </div>
  )
}
