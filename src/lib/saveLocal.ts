import type { Tarea } from '@/data/DataTypes'

const readLocal = (key: string): Tarea[] => {
  if (typeof window !== 'undefined') {
    const item = localStorage.getItem(key)
    if (item) {
      return JSON.parse(item)
    }
  }
  return []
}
const saveLocal = (key: string, value: Tarea) => {
  if (typeof window !== 'undefined') {
    const listaTareas = readLocal(key)
    listaTareas.push(value)
    localStorage.setItem(key, JSON.stringify(listaTareas))
  }
}
const updateLocal = (key: string, listaDeTareas: Tarea[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(listaDeTareas))
  }
}
export { saveLocal, readLocal, updateLocal }
