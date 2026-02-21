import Paciente from '../models/Paciente.js'

export const listarPacientes = async (req, res) => {
  try {
    const pacientes = await Paciente.find().select('-__v')
    res.status(200).json({ msg: 'Pacientes listados correctamente', total: pacientes.length, pacientes })
  } catch (e) { res.status(500).json({ msg: `Error en el servidor: ${e.message}` }) }
}

export const detallePaciente = async (req, res) => {
  try {
    const { id } = req.params
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ msg: 'ID inválido' })
    const paciente = await Paciente.findById(id).select('-__v')
    if (!paciente) return res.status(404).json({ msg: 'Paciente no encontrado' })
    res.status(200).json({ msg: 'Paciente encontrado', paciente })
  } catch (e) { res.status(500).json({ msg: `Error en el servidor: ${e.message}` }) }
}

export const crearPaciente = async (req, res) => {
  try {
    const faltantes = ['nombre','apellido','genero','ciudad','telefono','email'].filter(c => !req.body[c])
    if (faltantes.length) return res.status(400).json({ msg: `Faltan campos obligatorios: ${faltantes.join(', ')}` })

    if (await Paciente.findOne({ email: req.body.email?.toLowerCase() }))
      return res.status(400).json({ msg: 'Ya existe un paciente con este email' })

    const paciente = await new Paciente(req.body).save()
    res.status(201).json({ msg: 'Paciente creado correctamente', paciente })
  } catch (e) {
    if (e.name === 'ValidationError') {
      const errores = Object.values(e.errors).map(err => err.message)
      return res.status(400).json({ msg: 'Error de validación', errores })
    }
    if (e.code === 11000) return res.status(400).json({ msg: `Ya existe un registro con este ${Object.keys(e.keyPattern)[0]}` })
    res.status(500).json({ msg: `Error en el servidor: ${e.message}` })
  }
}

export const actualizarPaciente = async (req, res) => {
  try {
    const { id } = req.params
    const data = req.body || {}
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ msg: 'ID inválido' })
    if (!Object.keys(data).length) return res.status(400).json({ msg: 'Debes enviar al menos un campo' })

    if (data.email) {
      const existe = await Paciente.findOne({ email: data.email.toLowerCase(), _id: { $ne: id } })
      if (existe) return res.status(400).json({ msg: 'Ya existe otro paciente con este email' })
    }

    const paciente = await Paciente.findByIdAndUpdate(id, data, { new: true, runValidators: true }).select('-__v')
    if (!paciente) return res.status(404).json({ msg: 'Paciente no encontrado' })
    res.status(200).json({ msg: 'Paciente actualizado correctamente', paciente })
  } catch (e) {
    if (e.name === 'ValidationError') return res.status(400).json({ msg: 'Error de validación', errores: Object.values(e.errors).map(err => err.message) })
    if (e.code === 11000) return res.status(400).json({ msg: `Ya existe un registro con este ${Object.keys(e.keyPattern)[0]}` })
    res.status(500).json({ msg: `Error en el servidor: ${e.message}` })
  }
}

export const eliminarPaciente = async (req, res) => {
  try {
    const { id } = req.params
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ msg: 'ID inválido' })
    const paciente = await Paciente.findByIdAndDelete(id)
    if (!paciente) return res.status(404).json({ msg: 'Paciente no encontrado' })
    res.status(200).json({ msg: 'Paciente eliminado correctamente', paciente })
  } catch (e) { res.status(500).json({ msg: `Error en el servidor: ${e.message}` }) }
}
