import { Router } from 'express'
import { listarPacientes, detallePaciente, crearPaciente, actualizarPaciente, eliminarPaciente } from '../controllers/paciente_controller.js'
import { verificarTokenJWT } from '../middlewares/JWT.js'

const router = Router()
router.get('/',    verificarTokenJWT, listarPacientes)
router.get('/:id', verificarTokenJWT, detallePaciente)
router.post('/',   verificarTokenJWT, crearPaciente)
router.put('/:id', verificarTokenJWT, actualizarPaciente)
router.delete('/:id', verificarTokenJWT, eliminarPaciente)
export default router
