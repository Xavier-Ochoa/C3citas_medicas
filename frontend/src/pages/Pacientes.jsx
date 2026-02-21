import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { Modal, Alert } from '../components/UI'
import { useAuth } from '../context/AuthContext'
import { getPacientes, crearPaciente, editarPaciente, borrarPaciente } from '../services/api'

const GENEROS = ['masculino', 'femenino', 'otro']
const VACIO = { nombre: '', apellido: '', fecha_nacimiento: '', genero: 'masculino', ciudad: '', direccion: '', telefono: '', email: '' }

export default function Pacientes() {
  const { usuario } = useAuth()
  const [pacientes, setPacientes]       = useState([])
  const [cargando, setCargando]         = useState(true)
  const [modal, setModal]               = useState(null)
  const [sel, setSel]                   = useState(null)
  const [form, setForm]                 = useState(VACIO)
  const [alerta, setAlerta]             = useState(null)
  const [guardando, setGuardando]       = useState(false)
  const [busqueda, setBusqueda]         = useState('')

  const cargar = async () => {
    try { const { data } = await getPacientes(); setPacientes(data.pacientes || []) }
    catch { setAlerta({ tipo: 'error', msg: 'Error al cargar pacientes' }) }
    finally { setCargando(false) }
  }
  useEffect(() => { cargar() }, [])

  const abrirCrear  = () => { setForm(VACIO); setModal('crear') }
  const abrirEditar = (p) => {
    setSel(p); setModal('editar')
    setForm({ nombre: p.nombre, apellido: p.apellido, fecha_nacimiento: p.fecha_nacimiento ? p.fecha_nacimiento.slice(0,10) : '', genero: p.genero, ciudad: p.ciudad, direccion: p.direccion || '', telefono: p.telefono, email: p.email })
  }
  const abrirEliminar = (p) => { setSel(p); setModal('eliminar') }
  const cerrar = () => { setModal(null); setSel(null) }

  const handleGuardar = async (e) => {
    e.preventDefault(); setGuardando(true)
    try {
      if (modal === 'crear') await crearPaciente(form)
      else await editarPaciente(sel._id, form)
      setAlerta({ tipo: 'success', msg: modal === 'crear' ? 'Paciente creado correctamente' : 'Paciente actualizado correctamente' })
      cerrar(); cargar()
    } catch (err) { setAlerta({ tipo: 'error', msg: err.response?.data?.msg || 'Error al guardar' }) }
    finally { setGuardando(false) }
  }

  const handleEliminar = async () => {
    setGuardando(true)
    try { await borrarPaciente(sel._id); setAlerta({ tipo: 'success', msg: 'Paciente eliminado correctamente' }); cerrar(); cargar() }
    catch { setAlerta({ tipo: 'error', msg: 'Error al eliminar paciente' }) }
    finally { setGuardando(false) }
  }

  const filtrados = pacientes.filter(p => `${p.nombre} ${p.apellido} ${p.email} ${p.telefono}`.toLowerCase().includes(busqueda.toLowerCase()))
  const badgeGenero = (g) => ({ masculino: 'bg-blue-500/15 text-blue-400', femenino: 'bg-pink-500/15 text-pink-400', otro: 'bg-ink-500 text-ink-300' }[g] || '')

  return (
    <Layout>
      <div className="p-8 fade-in">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-ink-300 text-sm mb-1">Bienvenido — <span className="text-med-400">{usuario?.nombre} {usuario?.apellido}</span></p>
            <h1 className="font-display font-bold text-3xl text-white">Pacientes</h1>
            <p className="text-ink-300 text-sm mt-1">{pacientes.length} paciente{pacientes.length !== 1 ? 's' : ''} registrado{pacientes.length !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={abrirCrear} className="btn-primary flex items-center gap-2"><span className="text-lg leading-none">+</span> Nuevo paciente</button>
        </div>

        {alerta && <div className="mb-6"><Alert tipo={alerta.tipo} mensaje={alerta.msg} onClose={() => setAlerta(null)} /></div>}

        <div className="mb-5">
          <input type="text" placeholder="Buscar por nombre, email o teléfono..." className="input-field max-w-sm" value={busqueda} onChange={e => setBusqueda(e.target.value)} />
        </div>

        <div className="card overflow-hidden">
          {cargando ? <div className="p-12 text-center text-ink-300">Cargando...</div>
          : filtrados.length === 0 ? <div className="p-12 text-center text-ink-300">No hay pacientes registrados</div>
          : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-ink-600/50">
                  <tr>{['Nombre', 'Apellido', 'Género', 'Ciudad', 'Teléfono', 'Email', 'Acciones'].map(h => <th key={h} className="table-header">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {filtrados.map(p => (
                    <tr key={p._id} className="table-row">
                      <td className="table-cell font-medium text-white">{p.nombre}</td>
                      <td className="table-cell">{p.apellido}</td>
                      <td className="table-cell"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badgeGenero(p.genero)}`}>{p.genero}</span></td>
                      <td className="table-cell">{p.ciudad}</td>
                      <td className="table-cell">{p.telefono}</td>
                      <td className="table-cell">{p.email}</td>
                      <td className="table-cell">
                        <div className="flex items-center gap-2">
                          <button onClick={() => abrirEditar(p)} className="btn-edit text-xs">Editar</button>
                          <button onClick={() => abrirEliminar(p)} className="btn-danger text-xs">Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {(modal === 'crear' || modal === 'editar') && (
        <Modal titulo={modal === 'crear' ? 'Nuevo paciente' : 'Editar paciente'} onClose={cerrar}>
          <form onSubmit={handleGuardar} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-xs font-medium text-ink-300 mb-1.5">Nombre *</label><input className="input-field" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} placeholder="Juan" required /></div>
              <div><label className="block text-xs font-medium text-ink-300 mb-1.5">Apellido *</label><input className="input-field" value={form.apellido} onChange={e => setForm({...form, apellido: e.target.value})} placeholder="Pérez" required /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-xs font-medium text-ink-300 mb-1.5">Género *</label>
                <select className="input-field" value={form.genero} onChange={e => setForm({...form, genero: e.target.value})}>
                  {GENEROS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div><label className="block text-xs font-medium text-ink-300 mb-1.5">Fecha de nacimiento</label><input type="date" className="input-field" value={form.fecha_nacimiento} onChange={e => setForm({...form, fecha_nacimiento: e.target.value})} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-xs font-medium text-ink-300 mb-1.5">Ciudad *</label><input className="input-field" value={form.ciudad} onChange={e => setForm({...form, ciudad: e.target.value})} placeholder="Quito" required /></div>
              <div><label className="block text-xs font-medium text-ink-300 mb-1.5">Teléfono *</label><input className="input-field" value={form.telefono} onChange={e => setForm({...form, telefono: e.target.value})} placeholder="0991234567" required /></div>
            </div>
            <div><label className="block text-xs font-medium text-ink-300 mb-1.5">Email *</label><input type="email" className="input-field" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="correo@ejemplo.com" required /></div>
            <div><label className="block text-xs font-medium text-ink-300 mb-1.5">Dirección</label><input className="input-field" value={form.direccion} onChange={e => setForm({...form, direccion: e.target.value})} placeholder="Av. Principal 123" /></div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="btn-primary flex-1" disabled={guardando}>{guardando ? 'Guardando...' : modal === 'crear' ? 'Crear paciente' : 'Guardar cambios'}</button>
              <button type="button" onClick={cerrar} className="btn-secondary">Cancelar</button>
            </div>
          </form>
        </Modal>
      )}

      {modal === 'eliminar' && (
        <Modal titulo="Eliminar paciente" onClose={cerrar}>
          <p className="text-slate-300 mb-2">¿Estás seguro de que deseas eliminar al paciente:</p>
          <p className="text-white font-semibold mb-6">"{sel?.nombre} {sel?.apellido}"</p>
          <Alert tipo="error" mensaje="Esta acción no se puede deshacer." />
          <div className="flex gap-3 mt-5">
            <button onClick={handleEliminar} className="btn-danger flex-1 py-2.5" disabled={guardando}>{guardando ? 'Eliminando...' : 'Sí, eliminar'}</button>
            <button onClick={cerrar} className="btn-secondary flex-1">Cancelar</button>
          </div>
        </Modal>
      )}
    </Layout>
  )
}
