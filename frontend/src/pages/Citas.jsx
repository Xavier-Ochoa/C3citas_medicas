import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { Modal, Alert } from '../components/UI'
import { useAuth } from '../context/AuthContext'
import { getCitas, getPacientes, getEspecialidades, crearCita, editarCita, borrarCita } from '../services/api'

const VACIO = { codigo: '', descripcion: '', paciente: '', especialidad: '' }

export default function Citas() {
  const { usuario } = useAuth()
  const [citas, setCitas]               = useState([])
  const [pacientes, setPacientes]       = useState([])
  const [especialidades, setEspecialidades] = useState([])
  const [cargando, setCargando]         = useState(true)
  const [modal, setModal]               = useState(null)
  const [sel, setSel]                   = useState(null)
  const [form, setForm]                 = useState(VACIO)
  const [alerta, setAlerta]             = useState(null)
  const [guardando, setGuardando]       = useState(false)
  const [busqueda, setBusqueda]         = useState('')
  const [vistaAgrupada, setVistaAgrupada] = useState(false)

  const cargar = async () => {
    try {
      const [cRes, pRes, eRes] = await Promise.all([getCitas(), getPacientes(), getEspecialidades()])
      setCitas(cRes.data.citas || [])
      setPacientes(pRes.data.pacientes || [])
      setEspecialidades(eRes.data.especialidades || [])
    } catch { setAlerta({ tipo: 'error', msg: 'Error al cargar datos' }) }
    finally { setCargando(false) }
  }
  useEffect(() => { cargar() }, [])

  const abrirCrear  = () => { setForm(VACIO); setModal('crear') }
  const abrirEditar = (c) => {
    setSel(c); setModal('editar')
    setForm({ codigo: c.codigo, descripcion: c.descripcion || '', paciente: c.paciente?._id || c.paciente, especialidad: c.especialidad?._id || c.especialidad })
  }
  const abrirEliminar = (c) => { setSel(c); setModal('eliminar') }
  const cerrar = () => { setModal(null); setSel(null) }

  const handleGuardar = async (e) => {
    e.preventDefault(); setGuardando(true)
    try {
      if (modal === 'crear') await crearCita(form)
      else await editarCita(sel._id, form)
      setAlerta({ tipo: 'success', msg: modal === 'crear' ? 'Cita creada correctamente' : 'Cita actualizada correctamente' })
      cerrar(); cargar()
    } catch (err) { setAlerta({ tipo: 'error', msg: err.response?.data?.msg || 'Error al guardar' }) }
    finally { setGuardando(false) }
  }

  const handleEliminar = async () => {
    setGuardando(true)
    try { await borrarCita(sel._id); setAlerta({ tipo: 'success', msg: 'Cita eliminada correctamente' }); cerrar(); cargar() }
    catch { setAlerta({ tipo: 'error', msg: 'Error al eliminar cita' }) }
    finally { setGuardando(false) }
  }

  const filtradas = citas.filter(c => {
    const p = `${c.paciente?.nombre || ''} ${c.paciente?.apellido || ''}`
    const e = c.especialidad?.nombre || ''
    return `${c.codigo} ${p} ${e}`.toLowerCase().includes(busqueda.toLowerCase())
  })

  // Agrupar por paciente
  const agrupadas = filtradas.reduce((acc, c) => {
    const key  = c.paciente?._id || 'sin'
    const nombre = c.paciente ? `${c.paciente.nombre} ${c.paciente.apellido}` : 'Sin paciente'
    if (!acc[key]) acc[key] = { nombre, email: c.paciente?.email, citas: [] }
    acc[key].citas.push(c)
    return acc
  }, {})

  return (
    <Layout>
      <div className="p-8 fade-in">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-ink-300 text-sm mb-1">Bienvenido — <span className="text-med-400">{usuario?.nombre} {usuario?.apellido}</span></p>
            <h1 className="font-display font-bold text-3xl text-white">Citas Médicas</h1>
            <p className="text-ink-300 text-sm mt-1">{citas.length} cita{citas.length !== 1 ? 's' : ''} registrada{citas.length !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={abrirCrear} className="btn-primary flex items-center gap-2"><span className="text-lg leading-none">+</span> Nueva cita</button>
        </div>

        {alerta && <div className="mb-6"><Alert tipo={alerta.tipo} mensaje={alerta.msg} onClose={() => setAlerta(null)} /></div>}

        <div className="flex items-center gap-4 mb-5 flex-wrap">
          <input type="text" placeholder="Buscar por código, paciente o especialidad..." className="input-field max-w-sm" value={busqueda} onChange={e => setBusqueda(e.target.value)} />
          <div className="flex items-center gap-2 bg-ink-800 border border-ink-600/50 rounded-xl p-1">
            <button onClick={() => setVistaAgrupada(false)} className={`text-xs px-3 py-1.5 rounded-lg transition-all ${!vistaAgrupada ? 'bg-med-500 text-white' : 'text-ink-300 hover:text-white'}`}>Lista</button>
            <button onClick={() => setVistaAgrupada(true)}  className={`text-xs px-3 py-1.5 rounded-lg transition-all ${vistaAgrupada  ? 'bg-med-500 text-white' : 'text-ink-300 hover:text-white'}`}>Por paciente</button>
          </div>
        </div>

        {cargando ? (
          <div className="card p-12 text-center text-ink-300">Cargando...</div>
        ) : filtradas.length === 0 ? (
          <div className="card p-12 text-center text-ink-300">No hay citas registradas</div>
        ) : vistaAgrupada ? (
          <div className="space-y-6">
            {Object.values(agrupadas).map(({ nombre, email, citas: cs }) => (
              <div key={nombre} className="card overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 bg-ink-700/40 border-b border-ink-600/50">
                  <div className="w-8 h-8 rounded-full bg-med-500/20 border border-med-500/30 flex items-center justify-center text-med-400 text-xs font-bold">{nombre[0]}</div>
                  <div>
                    <p className="text-white font-semibold text-sm">{nombre}</p>
                    {email && <p className="text-ink-300 text-xs">{email}</p>}
                  </div>
                  <span className="ml-auto text-xs bg-med-500/15 text-med-400 px-2.5 py-1 rounded-full font-medium">{cs.length} cita{cs.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-ink-600/30">
                      <tr>{['Código', 'Especialidad', 'Descripción', 'Acciones'].map(h => <th key={h} className="table-header">{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {cs.map(c => (
                        <tr key={c._id} className="table-row">
                          <td className="table-cell font-mono text-med-400 text-xs font-semibold">{c.codigo}</td>
                          <td className="table-cell text-white">{c.especialidad?.nombre}</td>
                          <td className="table-cell text-ink-300 text-xs max-w-xs truncate">{c.descripcion || '—'}</td>
                          <td className="table-cell">
                            <div className="flex items-center gap-2">
                              <button onClick={() => abrirEditar(c)} className="btn-edit text-xs">Editar</button>
                              <button onClick={() => abrirEliminar(c)} className="btn-danger text-xs">Eliminar</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-ink-600/50">
                  <tr>{['Código', 'Paciente', 'Especialidad', 'Descripción', 'Acciones'].map(h => <th key={h} className="table-header">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {filtradas.map(c => (
                    <tr key={c._id} className="table-row">
                      <td className="table-cell font-mono text-med-400 text-xs font-semibold">{c.codigo}</td>
                      <td className="table-cell font-medium text-white">{c.paciente?.nombre} {c.paciente?.apellido}</td>
                      <td className="table-cell">{c.especialidad?.nombre}</td>
                      <td className="table-cell text-ink-300 text-xs max-w-xs truncate">{c.descripcion || '—'}</td>
                      <td className="table-cell">
                        <div className="flex items-center gap-2">
                          <button onClick={() => abrirEditar(c)} className="btn-edit text-xs">Editar</button>
                          <button onClick={() => abrirEliminar(c)} className="btn-danger text-xs">Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {(modal === 'crear' || modal === 'editar') && (
        <Modal titulo={modal === 'crear' ? 'Nueva cita' : 'Editar cita'} onClose={cerrar}>
          <form onSubmit={handleGuardar} className="space-y-4">
            <div><label className="block text-xs font-medium text-ink-300 mb-1.5">Código *</label><input className="input-field" value={form.codigo} onChange={e => setForm({...form, codigo: e.target.value})} placeholder="CIT-001" required /></div>
            <div>
              <label className="block text-xs font-medium text-ink-300 mb-1.5">Paciente *</label>
              <select className="input-field" value={form.paciente} onChange={e => setForm({...form, paciente: e.target.value})} required>
                <option value="">— Selecciona un paciente —</option>
                {pacientes.map(p => <option key={p._id} value={p._id}>{p.nombre} {p.apellido} — {p.email}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-300 mb-1.5">Especialidad *</label>
              <select className="input-field" value={form.especialidad} onChange={e => setForm({...form, especialidad: e.target.value})} required>
                <option value="">— Selecciona una especialidad —</option>
                {especialidades.map(e => <option key={e._id} value={e._id}>{e.nombre} ({e.codigo})</option>)}
              </select>
            </div>
            <div><label className="block text-xs font-medium text-ink-300 mb-1.5">Descripción</label><textarea className="input-field resize-none" rows={2} value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} placeholder="Motivo de la cita..." /></div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="btn-primary flex-1" disabled={guardando}>{guardando ? 'Guardando...' : modal === 'crear' ? 'Crear cita' : 'Guardar cambios'}</button>
              <button type="button" onClick={cerrar} className="btn-secondary">Cancelar</button>
            </div>
          </form>
        </Modal>
      )}

      {modal === 'eliminar' && (
        <Modal titulo="Eliminar cita" onClose={cerrar}>
          <p className="text-slate-300 mb-2">¿Estás seguro de que deseas eliminar la cita:</p>
          <p className="text-white font-semibold mb-6">"{sel?.codigo}"</p>
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
