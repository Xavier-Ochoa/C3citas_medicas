import Especialidad from '../models/Especialidad.js'

export const listarEspecialidades = async (req, res) => {
  try {
    const especialidades = await Especialidad.find().select('-__v')
    res.status(200).json({ msg: 'Especialidades listadas correctamente', total: especialidades.length, especialidades })
  } catch (e) { res.status(500).json({ msg: `Error en el servidor: ${e.message}` }) }
}

export const detalleEspecialidad = async (req, res) => {
  try {
    const { id } = req.params
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ msg: 'ID inválido' })
    const especialidad = await Especialidad.findById(id).select('-__v')
    if (!especialidad) return res.status(404).json({ msg: 'Especialidad no encontrada' })
    res.status(200).json({ msg: 'Especialidad encontrada', especialidad })
  } catch (e) { res.status(500).json({ msg: `Error en el servidor: ${e.message}` }) }
}

export const crearEspecialidad = async (req, res) => {
  try {
    const faltantes = ['codigo','nombre'].filter(c => !req.body[c])
    if (faltantes.length) return res.status(400).json({ msg: `Faltan campos obligatorios: ${faltantes.join(', ')}` })

    if (await Especialidad.findOne({ codigo: req.body.codigo?.toUpperCase() }))
      return res.status(400).json({ msg: 'Ya existe una especialidad con este código' })

    const especialidad = await new Especialidad(req.body).save()
    res.status(201).json({ msg: 'Especialidad creada correctamente', especialidad })
  } catch (e) {
    if (e.name === 'ValidationError') return res.status(400).json({ msg: 'Error de validación', errores: Object.values(e.errors).map(err => err.message) })
    if (e.code === 11000) return res.status(400).json({ msg: `Ya existe un registro con este ${Object.keys(e.keyPattern)[0]}` })
    res.status(500).json({ msg: `Error en el servidor: ${e.message}` })
  }
}

export const actualizarEspecialidad = async (req, res) => {
  try {
    const { id } = req.params
    const data = req.body || {}
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ msg: 'ID inválido' })
    if (!Object.keys(data).length) return res.status(400).json({ msg: 'Debes enviar al menos un campo' })

    if (data.codigo) {
      const existe = await Especialidad.findOne({ codigo: data.codigo.toUpperCase(), _id: { $ne: id } })
      if (existe) return res.status(400).json({ msg: 'Ya existe otra especialidad con este código' })
      data.codigo = data.codigo.toUpperCase()
    }

    const especialidad = await Especialidad.findByIdAndUpdate(id, data, { new: true, runValidators: true }).select('-__v')
    if (!especialidad) return res.status(404).json({ msg: 'Especialidad no encontrada' })
    res.status(200).json({ msg: 'Especialidad actualizada correctamente', especialidad })
  } catch (e) {
    if (e.name === 'ValidationError') return res.status(400).json({ msg: 'Error de validación', errores: Object.values(e.errors).map(err => err.message) })
    if (e.code === 11000) return res.status(400).json({ msg: `Ya existe un registro con este ${Object.keys(e.keyPattern)[0]}` })
    res.status(500).json({ msg: `Error en el servidor: ${e.message}` })
  }
}

export const eliminarEspecialidad = async (req, res) => {
  try {
    const { id } = req.params
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ msg: 'ID inválido' })
    const especialidad = await Especialidad.findByIdAndDelete(id)
    if (!especialidad) return res.status(404).json({ msg: 'Especialidad no encontrada' })
    res.status(200).json({ msg: 'Especialidad eliminada correctamente', especialidad })
  } catch (e) { res.status(500).json({ msg: `Error en el servidor: ${e.message}` }) }
}
