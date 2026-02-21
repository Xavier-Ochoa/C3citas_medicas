import axios from 'axios'

const api = axios.create({ baseURL: 'https://PON-AQUI-TU-URL-BACKEND.vercel.app/api', headers: { 'Content-Type': 'application/json' } })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token_caso3')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const loginApi             = (data)       => api.post('/auth/login', data)

export const getPacientes         = ()           => api.get('/pacientes')
export const crearPaciente        = (data)       => api.post('/pacientes', data)
export const editarPaciente       = (id, data)   => api.put(`/pacientes/${id}`, data)
export const borrarPaciente       = (id)         => api.delete(`/pacientes/${id}`)

export const getEspecialidades    = ()           => api.get('/especialidades')
export const crearEspecialidad    = (data)       => api.post('/especialidades', data)
export const editarEspecialidad   = (id, data)   => api.put(`/especialidades/${id}`, data)
export const borrarEspecialidad   = (id)         => api.delete(`/especialidades/${id}`)

export const getCitas             = ()           => api.get('/citas')
export const crearCita            = (data)       => api.post('/citas', data)
export const editarCita           = (id, data)   => api.put(`/citas/${id}`, data)
export const borrarCita           = (id)         => api.delete(`/citas/${id}`)

export default api
