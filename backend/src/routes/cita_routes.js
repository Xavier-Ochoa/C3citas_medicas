import { Router } from 'express'
import { listarCitas, detalleCita, crearCita, actualizarCita, eliminarCita } from '../controllers/cita_controller.js'
import { verificarTokenJWT } from '../middlewares/JWT.js'

const router = Router()
router.get('/',    verificarTokenJWT, listarCitas)
router.get('/:id', verificarTokenJWT, detalleCita)
router.post('/',   verificarTokenJWT, crearCita)
router.put('/:id', verificarTokenJWT, actualizarCita)
router.delete('/:id', verificarTokenJWT, eliminarCita)
export default router
