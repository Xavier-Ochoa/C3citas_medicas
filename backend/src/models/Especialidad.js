import { Schema, model } from 'mongoose'

const especialidadSchema = new Schema({
  codigo:      { type: String, required: [true, 'El código es obligatorio'],      unique: true, trim: true, uppercase: true },
  nombre:      { type: String, required: [true, 'El nombre es obligatorio'],      trim: true },
  descripcion: { type: String, trim: true, default: null }
}, { timestamps: true })

export default model('Especialidad', especialidadSchema)
