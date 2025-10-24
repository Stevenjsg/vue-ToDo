import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiClient from '@/services/api'

// Define la interfaz para un proyecto (simplificada por ahora)
interface Project {
  id: number
  nombre: string
  owner_id: number
  // Añade otros campos si los necesitas mostrar
}

export const useProjectStore = defineStore('projects', () => {
  // --- STATE ---
  const projects = ref<Project[]>([]) // Lista de proyectos del usuario
  const isLoading = ref(false)
  const currentProjectId = ref<number | null>(null) // ID del proyecto activo

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
      const response = await apiClient.get('/projects')
      projects.value = response.data
      // Opcional: Establecer un proyecto por defecto si no hay uno activo
      if (!currentProjectId.value && projects.value.length > 0) {
        // Selecciona el primer proyecto o uno guardado en localStorage
        // setCurrentProject(projects.value[0].id);
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
      projects.value = [] // Limpia en caso de error
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Establece el proyecto activo.
   */
  const setCurrentProject = (id: number | null) => {
    currentProjectId.value = id
    // Opcional: Guardar en localStorage para persistencia
    // localStorage.setItem('activeProjectId', id ? String(id) : '');
  }

  /**
   * Crea un nuevo proyecto.
   */
  const createProject = async (name: string, description?: string) => {
    try {
      const response = await apiClient.post('/projects', { nombre: name, description })
      projects.value.push(response.data) // Añade el nuevo proyecto a la lista local
      setCurrentProject(response.data.id) // Opcional: Hacerlo el proyecto activo
      return response.data // Devuelve el proyecto creado
    } catch (error) {
      console.error('Error creating project:', error)
      throw error // Lanza el error para que el componente lo maneje
    }
  }

  return {
    projects,
    isLoading,
    currentProjectId,
    projectList,
    activeProject,
    fetchProjects,
    setCurrentProject,
    createProject,
  }
})
