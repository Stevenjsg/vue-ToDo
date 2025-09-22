interface Tarea {
  id: number
  descripcion: string
  completada: boolean
  fechaCreacion: Date
  fechaModificacion: Date
  prioridad: 'baja' | 'media' | 'alta'
  etiquetas: string[]
  fechaVencimiento?: Date
  subtareas?: Tarea[]
}
export type { Tarea }
