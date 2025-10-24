import { ref, onMounted, onUnmounted, watch, type Ref } from 'vue'
import type { Item } from '@/data/DataTypes'
import apiClient from '@/services/api'
import { connectSocket, joinProjectRoom, leaveProjectRoom } from '@/services/socketService'
import type { Socket } from 'socket.io-client'
import { useAuthStore } from '@/stores/auth'

// Recibe el ID del proyecto como argumento reactivo (ref o computed)
export function useRealtimeItems(projectId: Ref<number | null>) {
  const items = ref<Item[]>([])
  const isLoading = ref(true)
  const authStore = useAuthStore()
  let socket: Socket | null = null

  // --- Fetch Data ---
  const fetchItems = async () => {
    // Solo busca si hay un proyecto seleccionado O si queremos items personales (projectId es null)
    try {
      isLoading.value = true
      console.log(`Fetching items for project ID: ${projectId.value}`)
      const response = await apiClient.get('/items', {
        params: {
          tipo: 'task', // Asumiendo que siempre son tareas en este contexto
          proyectoId: projectId.value, // Usa el ID reactivo
        },
      })
      items.value = response.data
      console.log(`FETCH: items.value DESPUÉS de asignar (${projectId.value}):`, [...items.value]) // Copia para ver estado
    } catch (error: unknown) {
      console.error('Error fetching items:', error)
      items.value = []
      // Considerar manejo de errores (ej. logout en 401)
    } finally {
      isLoading.value = false
    }
  }

  // --- Real-time Event Handlers ---
  const handleItemCreated = (newItem: Item) => {
    console.log('Socket: New item received', newItem)
    // 👇 Comprueba si el proyecto_id del item coincide con el actual
    if (
      newItem.proyecto_id === projectId.value &&
      newItem.tipo === 'task' &&
      !items.value.some((t) => t.id === newItem.id)
    ) {
      console.log(`Adding item ${newItem.id} to current view (Project: ${projectId.value})`)
      items.value.unshift(newItem)
    } else {
      console.log(
        `Item ${newItem.id} ignored (Project mismatch: item has ${newItem.proyecto_id}, view is ${projectId.value})`,
      )
    }
  }
  const handleItemUpdated = (updatedItem: Item) => {
    console.log('Socket: Item update received', updatedItem)
    const index = items.value.findIndex((t) => t.id === updatedItem.id)

    if (index !== -1) {
      // Si el item estaba en la lista...
      // 👇 Comprueba si AÚN pertenece al proyecto actual
      if (updatedItem.proyecto_id === projectId.value && updatedItem.tipo === 'task') {
        console.log(`Updating item ${updatedItem.id} in current view (Project: ${projectId.value})`)
        items.value.splice(index, 1, updatedItem)
      } else {
        // Si cambió de proyecto o tipo, lo quitamos de ESTA lista
        console.log(
          `Removing item ${updatedItem.id} from current view due to project/type mismatch.`,
        )
        items.value.splice(index, 1)
      }
    } else if (updatedItem.proyecto_id === projectId.value && updatedItem.tipo === 'task') {
      // Si NO estaba en la lista pero AHORA pertenece a este proyecto (raro, pero posible)
      console.log(
        `Adding updated item ${updatedItem.id} to current view as it now matches (Project: ${projectId.value})`,
      )
      items.value.unshift(updatedItem)
    } else {
      console.log(`Updated item ${updatedItem.id} ignored (Project mismatch or not found)`)
    }
  }
  const handleItemDeleted = (data: { id: number; proyecto_id: number | null }) => {
    // Asume que el backend envía el proyecto_id también
    console.log('Socket: Item delete received', data)
    // 👇 Comprueba si el item eliminado pertenecía al proyecto actual (opcional, podrías borrarlo siempre)
    // No es estrictamente necesario comprobar el proyecto_id al borrar, ya que si no estaba, filter no hará nada.
    // Pero ayuda a depurar.
    const itemExists = items.value.some((t) => t.id === data.id)
    if (itemExists) {
      console.log(`Removing item ${data.id} from current view (Project: ${projectId.value})`)
      items.value = items.value.filter((t) => t.id !== data.id)
    } else {
      console.log(`Deleted item ${data.id} ignored (was not in current view).`)
    }
  }

  // --- Socket Listener Setup/Teardown ---
  const setupSocketListeners = () => {
    if (socket) {
      console.log('Attaching item listeners')
      socket.on('item_created', handleItemCreated)
      socket.on('item_updated', handleItemUpdated)
      socket.on('item_deleted', handleItemDeleted)
    }
  }
  const removeSocketListeners = () => {
    if (socket) {
      console.log('Removing item listeners')
      socket.off('item_created', handleItemCreated)
      socket.off('item_updated', handleItemUpdated)
      socket.off('item_deleted', handleItemDeleted)
    }
  }

  // --- Watcher para Cambios de Proyecto ---
  watch(
    projectId,
    async (newProjectId, oldProjectId) => {
      console.log(`useRealtimeItems: Project ID changed from ${oldProjectId} to ${newProjectId}`)
      await fetchItems() // Recarga items

      // Obtenemos el userId del store (asumiendo que lo tienes ahí después del login)
      // Necesitarías añadir 'userId' al estado/getters de tu authStore

      if (socket?.connected) {
        const userId = authStore.currentUserId

        if (!userId) {
          console.error('User ID not found in authStore for socket rooms. ', userId)
          return // Salir si no tenemos ID de usuario
        }
        console.log('Changing socket rooms...', userId)
        // Salir de la sala anterior (sea de proyecto o personal)
        if (oldProjectId !== null && oldProjectId !== undefined) {
          console.log(`Leaving project room: ${oldProjectId}`)
          leaveProjectRoom(oldProjectId)
        } else {
          // Si el anterior era null, significa que estábamos en sala personal
          console.log(`Leaving user room: ${userId}`)
          // leaveUserRoom(userId); // Necesitarías esta función en socketService
        }

        // Unirse a la nueva sala
        if (newProjectId !== null) {
          console.log(`Joining project room: ${newProjectId}`)
          joinProjectRoom(newProjectId)
        } else {
          console.log(`Joining user room: ${userId}`)
          // joinUserRoom(userId); // Llama a la función para unirse a sala personal
        }
      } else {
        console.warn('Cannot change socket room: Socket not connected when project changed.')
      }
    },
    { immediate: true },
  )
  // --- Gestión del Ciclo de Vida del Socket (dentro del composable) ---
  onMounted(async () => {
    console.log('useRealtimeItems: Component mounted, attempting socket connection...')
    try {
      if (!authStore.currentUserId && authStore.isAuthenticated) {
        console.log('Waiting for user profile before connecting socket...')
        // Si fetchUserProfile devuelve una promesa, puedes esperarla.
        // Si no, necesitamos un mecanismo para saber cuándo termina.
        // Podrías añadir un flag 'isProfileLoaded' al authStore.
        // await authStore.fetchUserProfile(); // Llama si aún no se ha llamado
      }
      socket = await connectSocket() // Conecta y guarda la instancia local
      setupSocketListeners() // Configura listeners una vez conectado
      // La unión inicial a la sala la hace el watcher con immediate: true
    } catch (error) {
      console.error('Failed to connect socket in useRealtimeItems onMounted:', error)
      socket = null // Asegura que socket sea null si falla la conexión
    }
  })

  onUnmounted(() => {
    console.log('useRealtimeItems: Component unmounted, cleaning up...')
    removeSocketListeners()
    // Salir de la sala actual al desmontar
    if (projectId.value !== null && socket) {
      console.log(`Leaving project room on unmount: ${projectId.value}`)
      leaveProjectRoom(projectId.value)
    }
    // Decide si desconectar el socket aquí o si se gestiona globalmente (ej. en logout)
    // disconnectSocket(); // Podría desconectar a otros usuarios si comparten instancia
  })

  // Devuelve el estado reactivo y la función de recarga
  return { items, isLoading, fetchItems }
}
