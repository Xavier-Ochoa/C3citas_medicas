import express from 'express'
import cors from 'cors'
import session from 'express-session'
import dotenv from 'dotenv'
import authRoutes         from './routes/auth_routes.js'
import pacienteRoutes     from './routes/paciente_routes.js'
import especialidadRoutes from './routes/especialidad_routes.js'
import citaRoutes         from './routes/cita_routes.js'

dotenv.config()
const app = express()

app.use(express.json())
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://c3citas-medicasfront.vercel.app',    
    process.env.URL_FRONTEND,
  ].filter(Boolean),
  methods: ['GET','POST','PUT','DELETE'],
  credentials: true
}))
app.use(session({
  secret: process.env.SESSION_SECRET || 'secreto_citas_medicas',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production', httpOnly: true, maxAge: 24*60*60*1000 }
}))

app.get('/', (_, res) => res.send('🏥 API – Sistema de Gestión de Citas Médicas'))
app.use('/api/auth',           authRoutes)
app.use('/api/pacientes',      pacienteRoutes)
app.use('/api/especialidades', especialidadRoutes)
app.use('/api/citas',          citaRoutes)

app.use((req, res) => res.status(404).json({ msg: 'Endpoint no encontrado' }))
app.use((err, req, res, next) => res.status(500).json({ msg: 'Error interno del servidor' }))

export default app
