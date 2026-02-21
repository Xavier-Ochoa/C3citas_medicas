import { Schema, model } from 'mongoose'

const citaSchema = new Schema({
  codigo:       { type: String, required: [true, 'El código es obligatorio'], unique: true, trim: true },
  descripcion:  { type: String, trim: true, default: null },
  paciente:     { type: Schema.Types.ObjectId, ref: 'Paciente',     required: [true, 'El paciente es obligatorio'] },
  especialidad: { type: Schema.Types.ObjectId, ref: 'Especialidad', required: [true, 'La especialidad es obligatoria'] }
}, { timestamps: true })

export default model('Cita', citaSchema)
