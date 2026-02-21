import Cita from '../models/Cita.js'
import Paciente from '../models/Paciente.js'
import Especialidad from '../models/Especialidad.js'

const populate = q => q.populate('paciente', '-__v').populate('especialidad', '-__v').select('-__v')

export const listarCitas = async (req, res) => {
  try {
    const citas = await populate(Cita.find())
    res.status(200).json({ msg: 'Citas listadas correctamente', total: citas.length, citas })
  } catch (e) { res.status(500).json({ msg: `Error en el servidor: ${e.message}` }) }
}

export const detalleCita = async (req, res) => {
  try {
    const { id } = req.params
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ msg: 'ID inválido' })
    const cita = await populate(Cita.findById(id))
    if (!cita) return res.status(404).json({ msg: 'Cita no encontrada' })
    res.status(200).json({ msg: 'Cita encontrada', cita })
  } catch (e) { res.status(500).json({ msg: `Error en el servidor: ${e.message}` }) }
}

export const crearCita = async (req, res) => {
  try {
    const { codigo, descripcion, paciente, especialidad } = req.body
    const faltantes = ['codigo','paciente','especialidad'].filter(c => !req.body[c])
    if (faltantes.length) return res.status(400).json({ msg: `Faltan campos obligatorios: ${faltantes.join(', ')}` })

    if (await Cita.findOne({ codigo: codigo.trim() }))
      return res.status(400).json({ msg: 'Ya existe una cita con este código' })

    if (!paciente.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ msg: 'ID de paciente inválido' })
    if (!await Paciente.findById(paciente)) return res.status(404).json({ msg: 'El paciente indicado no existe' })

    if (!especialidad.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ msg: 'ID de especialidad inválido' })
    if (!await Especialidad.findById(especialidad)) return res.status(404).json({ msg: 'La especialidad indicada no existe' })

    const nueva = await new Cita({ codigo: codigo.trim(), descripcion: descripcion || null, paciente, especialidad }).save()
    const cita  = await populate(Cita.findById(nueva._id))
    res.status(201).json({ msg: 'Cita creada correctamente', cita })
  } catch (e) {
    if (e.name === 'ValidationError') return res.status(400).json({ msg: 'Error de validación', errores: Object.values(e.errors).map(err => err.message) })
    if (e.code === 11000) return res.status(400).json({ msg: `Ya existe un registro con este ${Object.keys(e.keyPattern)[0]}` })
    res.status(500).json({ msg: `Error en el servidor: ${e.message}` })
  }
}

export const actualizarCita = async (req, res) => {
  try {
    const { id } = req.params
    const data = req.body || {}
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ msg: 'ID inválido' })
    if (!Object.keys(data).length) return res.status(400).json({ msg: 'Debes enviar al menos un campo' })

    if (data.codigo) {
      const existe = await Cita.findOne({ codigo: data.codigo.trim(), _id: { $ne: id } })
      if (existe) return res.status(400).json({ msg: 'Ya existe otra cita con este código' })
      data.codigo = data.codigo.trim()
    }
    if (data.paciente) {
      if (!data.paciente.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ msg: 'ID de paciente inválido' })
      if (!await Paciente.findById(data.paciente)) return res.status(404).json({ msg: 'El paciente indicado no existe' })
    }
    if (data.especialidad) {
      if (!data.especialidad.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ msg: 'ID de especialidad inválido' })
      if (!await Especialidad.findById(data.especialidad)) return res.status(404).json({ msg: 'La especialidad indicada no existe' })
    }

    const cita = await populate(Cita.findByIdAndUpdate(id, data, { new: true, runValidators: true }))
    if (!cita) return res.status(404).json({ msg: 'Cita no encontrada' })
    res.status(200).json({ msg: 'Cita actualizada correctamente', cita })
  } catch (e) {
    if (e.name === 'ValidationError') return res.status(400).json({ msg: 'Error de validación', errores: Object.values(e.errors).map(err => err.message) })
    if (e.code === 11000) return res.status(400).json({ msg: `Ya existe un registro con este ${Object.keys(e.keyPattern)[0]}` })
    res.status(500).json({ msg: `Error en el servidor: ${e.message}` })
  }
}

export const eliminarCita = async (req, res) => {
  try {
    const { id } = req.params
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ msg: 'ID inválido' })
    const cita = await populate(Cita.findByIdAndDelete(id))
    if (!cita) return res.status(404).json({ msg: 'Cita no encontrada' })
    res.status(200).json({ msg: 'Cita eliminada correctamente', cita })
  } catch (e) { res.status(500).json({ msg: `Error en el servidor: ${e.message}` }) }
}
