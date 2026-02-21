import mongoose from 'mongoose'
import dotenv from 'dotenv'
import app from './server.js'

dotenv.config()

const PORT = process.env.PORT || 3001

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Conexión a MongoDB exitosa — Base de datos: caso3')
    app.listen(PORT, () => console.log(`🚀 Servidor corriendo en el puerto ${PORT}`))
  })
  .catch(err => {
    console.error('❌ Error al conectar MongoDB:', err.message)
    process.exit(1)
  })

export default app
