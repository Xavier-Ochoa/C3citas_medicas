import { Router } from 'express'
import { listarEspecialidades, detalleEspecialidad, crearEspecialidad, actualizarEspecialidad, eliminarEspecialidad } from '../controllers/especialidad_controller.js'
import { verificarTokenJWT } from '../middlewares/JWT.js'

const router = Router()
router.get('/',    verificarTokenJWT, listarEspecialidades)
router.get('/:id', verificarTokenJWT, detalleEspecialidad)
router.post('/',   verificarTokenJWT, crearEspecialidad)
router.put('/:id', verificarTokenJWT, actualizarEspecialidad)
router.delete('/:id', verificarTokenJWT, eliminarEspecialidad)
export default router
