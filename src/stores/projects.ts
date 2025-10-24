import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiClient from '@/services/api'
import router from '@/router' // Import router if needed for navigation

// Define la interfaz completa para un Proyecto (ajústala si es necesario)
export interface Project {
  id: number
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
  // Intenta cargar el ID del proyecto activo desde localStorage al iniciar
  const currentProjectId = ref<number | null>(
    (() => {
      const savedId = localStorage.getItem('activeProjectId')
      // Asegúrate de manejar NaN si parseInt falla
      const parsedId = savedId ? parseInt(savedId, 10) : NaN
      return !isNaN(parsedId) ? parsedId : null
    })(),
  ) // <-- Ejecuta la función inmediatamente

  // --- GETTERS ---
  const projectList = computed(() => projects.value)
  const activeProject = computed(() => projects.value.find((p) => p.id === currentProjectId.value))

  // --- ACTIONS ---

  /**
   * Obtiene los proyectos del usuario desde la API.
   */
  const fetchProjects = async () => {
    isLoading.value = true
    try {
      const response = await apiClient.get<Project[]>('/projects') // Especifica el tipo esperado
      projects.value = response.data

      // Valida que el currentProjectId siga siendo válido
      if (currentProjectId.value && !projects.value.some((p) => p.id === currentProjectId.value)) {
        setCurrentProject(null) // Si el proyecto activo ya no existe, deselecciónalo
      }
      // Si no hay proyecto activo y hay proyectos, selecciona el primero (o ninguno)
      else if (currentProjectId.value === null && projects.value.length > 0) {
        // Podrías seleccionar el primero por defecto: setCurrentProject(projects.value[0].id);
        // O dejarlo en null para forzar selección
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
      projects.value = [] // Limpia en caso de error
      setCurrentProject(null) // Asegura deseleccionar si falla
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Establece el proyecto activo y lo guarda en localStorage.
   */
  const setCurrentProject = (id: number | null) => {
    currentProjectId.value = id
    if (id !== null) {
      localStorage.setItem('activeProjectId', String(id))
    } else {
      localStorage.removeItem('activeProjectId')
    }
    // Opcional: Navegar a la vista de tareas asociada
    // if (id !== null) {
    //    router.push(`/app/tareas`); // O una ruta específica del proyecto si la tienes
    // } else {
    //    router.push(`/app/tareas`); // Ruta para tareas personales
    // }
  }

  /**
   * Crea un nuevo proyecto llamando a la API y actualiza el estado local.
   */
  const createProject = async (name: string, description?: string): Promise<Project> => {
    // No usamos try/catch aquí para que el componente que llama maneje el error
    const response = await apiClient.post<Project>('/projects', { nombre: name, description })
    projects.value.push(response.data) // Añade el nuevo proyecto a la lista
    setCurrentProject(response.data.id) // Hacerlo el proyecto activo
    return response.data // Devuelve el proyecto creado
  }

  /**
   * Actualiza un proyecto localmente en el store (después de una llamada API exitosa).
   */
  const updateProjectLocally = (updatedProject: Project) => {
    const index = projects.value.findIndex((p) => p.id === updatedProject.id)
    if (index !== -1) {
      projects.value.splice(index, 1, updatedProject)
    }
  }

  /**
   * Elimina un proyecto localmente del store (después de una llamada API exitosa).
   */
  const removeProjectLocally = (projectId: number) => {
    projects.value = projects.value.filter((p) => p.id !== projectId)
    // Si el proyecto eliminado era el activo, deselecciónalo
    if (currentProjectId.value === projectId) {
      setCurrentProject(null)
    }
  }

  return {
    // State
    projects,
    isLoading,
    currentProjectId,
    // Getters
    projectList,
    activeProject,
    // Actions
    fetchProjects,
    setCurrentProject,
    createProject,
    updateProjectLocally,
    removeProjectLocally,
  }
})
