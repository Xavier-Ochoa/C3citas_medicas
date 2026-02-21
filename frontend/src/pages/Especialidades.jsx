import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { Modal, Alert } from '../components/UI'
import { useAuth } from '../context/AuthContext'
import { getEspecialidades, crearEspecialidad, editarEspecialidad, borrarEspecialidad } from '../services/api'

const VACIO = { codigo: '', nombre: '', descripcion: '' }

export default function Especialidades() {
  const { usuario } = useAuth()
  const [especialidades, setEspecialidades] = useState([])
  const [cargando, setCargando]   = useState(true)
  const [modal, setModal]         = useState(null)
  const [sel, setSel]             = useState(null)
  const [form, setForm]           = useState(VACIO)
  const [alerta, setAlerta]       = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [busqueda, setBusqueda]   = useState('')

  const cargar = async () => {
    try { const { data } = await getEspecialidades(); setEspecialidades(data.especialidades || []) }
    catch { setAlerta({ tipo: 'error', msg: 'Error al cargar especialidades' }) }
    finally { setCargando(false) }
  }
  useEffect(() => { cargar() }, [])

  const abrirCrear  = () => { setForm(VACIO); setModal('crear') }
  const abrirEditar = (e) => { setSel(e); setForm({ codigo: e.codigo, nombre: e.nombre, descripcion: e.descripcion || '' }); setModal('editar') }
  const abrirEliminar = (e) => { setSel(e); setModal('eliminar') }
  const cerrar = () => { setModal(null); setSel(null) }

  const handleGuardar = async (e) => {
    e.preventDefault(); setGuardando(true)
    try {
      if (modal === 'crear') await crearEspecialidad(form)
      else await editarEspecialidad(sel._id, form)
      setAlerta({ tipo: 'success', msg: modal === 'crear' ? 'Especialidad creada correctamente' : 'Especialidad actualizada correctamente' })
      cerrar(); cargar()
    } catch (err) { setAlerta({ tipo: 'error', msg: err.response?.data?.msg || 'Error al guardar' }) }
    finally { setGuardando(false) }
  }

  const handleEliminar = async () => {
    setGuardando(true)
    try { await borrarEspecialidad(sel._id); setAlerta({ tipo: 'success', msg: 'Especialidad eliminada correctamente' }); cerrar(); cargar() }
    catch { setAlerta({ tipo: 'error', msg: 'Error al eliminar especialidad' }) }
    finally { setGuardando(false) }
  }

  const filtradas = especialidades.filter(e => `${e.codigo} ${e.nombre} ${e.descripcion || ''}`.toLowerCase().includes(busqueda.toLowerCase()))

  return (
    <Layout>
      <div className="p-8 fade-in">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-ink-300 text-sm mb-1">Bienvenido — <span className="text-med-400">{usuario?.nombre} {usuario?.apellido}</span></p>
            <h1 className="font-display font-bold text-3xl text-white">Especialidades</h1>
            <p className="text-ink-300 text-sm mt-1">{especialidades.length} especialidad{especialidades.length !== 1 ? 'es' : ''} registrada{especialidades.length !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={abrirCrear} className="btn-primary flex items-center gap-2"><span className="text-lg leading-none">+</span> Nueva especialidad</button>
        </div>

        {alerta && <div className="mb-6"><Alert tipo={alerta.tipo} mensaje={alerta.msg} onClose={() => setAlerta(null)} /></div>}

        <div className="mb-5">
          <input type="text" placeholder="Buscar por código o nombre..." className="input-field max-w-sm" value={busqueda} onChange={e => setBusqueda(e.target.value)} />
        </div>

        <div className="card overflow-hidden">
          {cargando ? <div className="p-12 text-center text-ink-300">Cargando...</div>
          : filtradas.length === 0 ? <div className="p-12 text-center text-ink-300">No hay especialidades registradas</div>
          : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-ink-600/50">
                  <tr>{['Código', 'Nombre', 'Descripción', 'Acciones'].map(h => <th key={h} className="table-header">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {filtradas.map(e => (
                    <tr key={e._id} className="table-row">
                      <td className="table-cell font-mono text-med-400 font-semibold text-xs">{e.codigo}</td>
                      <td className="table-cell font-medium text-white">{e.nombre}</td>
                      <td className="table-cell text-ink-300 text-xs max-w-xs truncate">{e.descripcion || '—'}</td>
                      <td className="table-cell">
                        <div className="flex items-center gap-2">
                          <button onClick={() => abrirEditar(e)} className="btn-edit text-xs">Editar</button>
                          <button onClick={() => abrirEliminar(e)} className="btn-danger text-xs">Eliminar</button>
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
        <Modal titulo={modal === 'crear' ? 'Nueva especialidad' : 'Editar especialidad'} onClose={cerrar}>
          <form onSubmit={handleGuardar} className="space-y-4">
            <div><label className="block text-xs font-medium text-ink-300 mb-1.5">Código *</label><input className="input-field uppercase" value={form.codigo} onChange={e => setForm({...form, codigo: e.target.value.toUpperCase()})} placeholder="CARD" required /></div>
            <div><label className="block text-xs font-medium text-ink-300 mb-1.5">Nombre *</label><input className="input-field" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} placeholder="Cardiología" required /></div>
            <div><label className="block text-xs font-medium text-ink-300 mb-1.5">Descripción</label><textarea className="input-field resize-none" rows={3} value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} placeholder="Descripción de la especialidad..." /></div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="btn-primary flex-1" disabled={guardando}>{guardando ? 'Guardando...' : modal === 'crear' ? 'Crear especialidad' : 'Guardar cambios'}</button>
              <button type="button" onClick={cerrar} className="btn-secondary">Cancelar</button>
            </div>
          </form>
        </Modal>
      )}

      {modal === 'eliminar' && (
        <Modal titulo="Eliminar especialidad" onClose={cerrar}>
          <p className="text-slate-300 mb-2">¿Estás seguro de que deseas eliminar la especialidad:</p>
          <p className="text-white font-semibold mb-6">"{sel?.nombre}"</p>
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
