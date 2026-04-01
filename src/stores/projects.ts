import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
<<<<<<< HEAD
import apiClient from '@services/api'
=======
import apiClient from '@/services/api'
// No importamos 'router' aquí para mantener el store desacoplado.
// La navegación debe manejarse en los componentes (ej. en TheSidebar)
>>>>>>> c5c5b96ab803be15a5e22af0f09e8200b040d8cd

// 1. Interfaz actualizada para incluir 'uuid'
export interface Project {
  id: number
  uuid: string // <-- AÑADIDO
  owner_id: number
  nombre: string
  descripcion: string | null
  fecha_creacion: string
  fecha_actualizacion: string
}

export const useProjectStore = defineStore('projects', () => {
  // --- STATE ---
  const projects = ref<Project[]>([])
  const isLoading = ref(false)

  // 2. Renombrado a 'Uuid' y ahora es un string
  const currentProjectUuid = ref<string | null>(
    (() => {
      // 3. Lee el Uuid de localStorage
      const savedUuid = localStorage.getItem('activeProjectUuid')
      return savedUuid || null // Simplemente guarda el string o null
    })(),
  )

  // --- GETTERS ---
  const projectList = computed(() => projects.value)

  // 4. El getter ahora busca por 'uuid'
  const activeProject = computed(() =>
    projects.value.find((p) => p.uuid === currentProjectUuid.value),
  )

  // --- ACTIONS ---

  const fetchProjects = async () => {
    isLoading.value = true
    try {
      const response = await apiClient.get<Project[]>('/projects')
      projects.value = response.data

      // 5. Valida que el 'uuid' guardado siga siendo válido
      if (
        currentProjectUuid.value &&
        !projects.value.some((p) => p.uuid === currentProjectUuid.value)
      ) {
        setCurrentProjectUuid(null) // Deselecciona si ya no existe
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
      projects.value = []
      setCurrentProjectUuid(null)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Establece el proyecto activo (por UUID) y lo guarda en localStorage.
   */
  const setCurrentProjectUuid = (uuid: string | null) => {
    currentProjectUuid.value = uuid
    if (uuid) {
      localStorage.setItem('activeProjectUuid', uuid)
    } else {
      localStorage.removeItem('activeProjectUuid')
    }
    // La navegación (router.push) debe hacerse en el componente que llama a esto
    // (ej. TheSidebar.vue) porque la ruta y el estado deben estar sincronizados.
  }

  /**
   * Crea un nuevo proyecto llamando a la API y actualiza el estado local.
   */
  const createProject = async (name: string, description?: string): Promise<Project> => {
    const response = await apiClient.post<Project>('/projects', { nombre: name, description })
    projects.value.push(response.data)

    // 7. Al crear, establece el nuevo 'uuid' como activo
    setCurrentProjectUuid(response.data.uuid)
    return response.data
  }

  /**
   * Actualiza un proyecto localmente en el store (basado en 'id' numérico).
   */
  const updateProjectLocally = (updatedProject: Project) => {
    const index = projects.value.findIndex((p) => p.id === updatedProject.id)
    if (index !== -1) {
      projects.value.splice(index, 1, updatedProject)
    }
  }

  /**
   * Elimina un proyecto localmente del store (basado en 'id' numérico).
   */
  const removeProjectLocally = (projectUuid: number) => {
    // 8. Lógica de deselección actualizada
    // Encuentra el proyecto que se va a borrar ANTES de filtrar la lista
    const projectToRemove = projects.value.find((p) => p.id === projectUuid)

    projects.value = projects.value.filter((p) => p.id !== projectUuid)

    // Si el proyecto eliminado era el activo (compara UUIDs), deselecciónalo
    if (projectToRemove && currentProjectUuid.value === projectToRemove.uuid) {
      setCurrentProjectUuid(null)
    }
  }

  return {
    // State
    projects,
    isLoading,
    currentProjectUuid, // <-- Renombrado
    // Getters
    projectList,
    activeProject,
    // Actions
    fetchProjects,
    setCurrentProjectUuid, // <-- Renombrado
    createProject,
    updateProjectLocally,
    removeProjectLocally,
  }
})
