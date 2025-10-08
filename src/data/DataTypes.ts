interface Tarea {
  id: number
  descripcion: string
  completada: boolean
  fecha_creacion: string
  fecha_modificacion: string
  prioridad: 'baja' | 'media' | 'alta'
  etiquetas: string[]
  fecha_vencimiento?: string
  subtareas?: Tarea[]
}
export type { Tarea }
