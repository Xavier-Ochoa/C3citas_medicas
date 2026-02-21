import { Schema, model } from 'mongoose'

const pacienteSchema = new Schema({
  nombre:           { type: String, required: [true, 'El nombre es obligatorio'],          trim: true },
  apellido:         { type: String, required: [true, 'El apellido es obligatorio'],        trim: true },
  fecha_nacimiento: { type: Date,   default: null },
  genero:           { type: String, enum: ['masculino', 'femenino', 'otro'], required: [true, 'El género es obligatorio'] },
  ciudad:           { type: String, required: [true, 'La ciudad es obligatoria'],          trim: true },
  direccion:        { type: String, trim: true, default: null },
  telefono:         { type: String, required: [true, 'El teléfono es obligatorio'],        trim: true },
  email:            { type: String, required: [true, 'El email es obligatorio'], unique: true, trim: true, lowercase: true }
}, { timestamps: true })

export default model('Paciente', pacienteSchema)
