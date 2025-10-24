<script setup lang="ts">
import { ref, onUnmounted, computed, watchEffect } from 'vue'
import { useAuthStore } from '@/stores/auth'
import apiClient from '@/services/api'
import type { Item } from '@/data/DataTypes'
import FormToDo from '@/components/FormToDo.vue'
import ListToDo from '@/components/ListToDo.vue'
import { type Socket } from 'socket.io-client'
import { connectSocket, joinProjectRoom, getSocket } from '@/services/socketService'
import { useProjectStore } from '@/stores/projects'

const projectStore = useProjectStore()
const authStore = useAuthStore()
const allItems = ref<Item[]>([])
const isLoading = ref(true)
const activeTag = ref<string | null>(null)
const completionFilter = ref<'all' | 'completed' | 'pending'>('all')

const setCompletionFilter = (filter: 'all' | 'completed' | 'pending') => {
  completionFilter.value = filter
}

// --- Fetch Data ---
const fetchItems = async () => {
  if (!authStore.isAuthenticated) return
  // 👇 Solo busca si hay un proyecto activo
  if (!projectStore.currentProjectId) {
    allItems.value = [] // Limpia la lista si no hay proyecto seleccionado
    isLoading.value = false
    return
  }

  try {
    isLoading.value = true
    // 👇 Pide solo items de TIPO 'task' Y del PROYECTO actual
    const response = await apiClient.get('/items', {
      params: {
        tipo: 'task',
        proyectoId: projectStore.currentProjectId, // 👈 Añade el filtro de proyecto
      },
    })
    allItems.value = response.data
  } catch (error) {
    console.error('Error fetching items:', error)
    allItems.value = []
  } finally {
    isLoading.value = false
  }
}
// --- Real-time Event Handlers ---
const handleItemCreated = (newItem: Item) => {
  console.log('Socket: New item received', newItem)
  if (newItem.tipo === 'task' && !allItems.value.some((t) => t.id === newItem.id)) {
    allItems.value.unshift(newItem)
  }
}

const handleItemUpdated = (updatedItem: Item) => {
  console.log('Socket: Item update received', updatedItem)
  const index = allItems.value.findIndex((t) => t.id === updatedItem.id)
  if (index !== -1) {
    if (updatedItem.tipo === 'task') {
      allItems.value.splice(index, 1, updatedItem)
    } else {
      allItems.value.splice(index, 1)
    }
  } else if (updatedItem.tipo === 'task') {
    allItems.value.unshift(updatedItem)
    console.log('Updated item added to list as it was not found.')
  }
}

const handleItemDeleted = (data: { id: number }) => {
  console.log('Socket: Item delete received', data)
  allItems.value = allItems.value.filter((t) => t.id !== data.id)
}

// --- Watcher for Authentication and Initial Setup ---
watchEffect(async () => {
  // Ya no necesitamos getSocket() aquí al principio

  if (authStore.isAuthenticated) {
    console.log('Usuario autenticado, ejecutando setup de watchEffect...')
    isLoading.value = true
    await fetchItems() // Obtiene datos

    const currentProjectId = 1 // Reemplaza con lógica real

    try {
      // Intenta obtener el socket, esperando la conexión si es necesario
      console.log('Esperando conexión del socket...')
      const currentSocket = await connectSocket() // Espera a que la promesa resuelva

      if (currentSocket?.connected) {
        console.log('Socket conectado, uniéndose a la sala y configurando listeners.')
        joinProjectRoom(currentProjectId) // joinProjectRoom ya no necesita async/await aquí
        removeSocketListeners() // Limpia listeners previos
        setupSocketListeners(currentSocket) // Pasa el socket a la función de setup
      } else {
        // Esto no debería ocurrir si connectSocket funciona bien
        console.error('Fallo al obtener instancia de socket conectado.')
        isLoading.value = false
      }
    } catch (error) {
      console.error('Error al conectar el socket en watchEffect:', error)
      isLoading.value = false
    }
  } else {
    // Usuario no autenticado
    allItems.value = []
    isLoading.value = false
    removeSocketListeners() // Limpia listeners al desloguear
    console.log('Usuario deslogueado, limpiando items y listeners.')
  }
})
// --- Socket Listener Setup/Teardown ---
// Ahora reciben la instancia del socket como argumento
const setupSocketListeners = (socketInstance: Socket) => {
  if (socketInstance) {
    console.log('Añadiendo listeners de socket')
    socketInstance.on('item_created', handleItemCreated)
    socketInstance.on('item_updated', handleItemUpdated)
    socketInstance.on('item_deleted', handleItemDeleted)
  } else {
    console.error('No se puede configurar listeners: instancia de socket inválida.')
  }
}

const removeSocketListeners = () => {
  const socketInstance = getSocket() // Obtén la instancia actual para limpiar
  if (socketInstance) {
    console.log('Quitando listeners de socket')
    socketInstance.off('item_created', handleItemCreated)
    socketInstance.off('item_updated', handleItemUpdated)
    socketInstance.off('item_deleted', handleItemDeleted)
  }
}
// --- Component Lifecycle Cleanup ---
onUnmounted(() => {
  removeSocketListeners()
  // Optional: Leave room logic if implemented in socketService
  // const currentProjectId = 1; // Replace with actual logic
  // leaveProjectRoom(currentProjectId);
})

// --- Action Handlers (Emit from Children) ---

const handleTareaAgregada = async (newItemData: {
  titulo: string
  descripcion?: string
  prioridad: string
  etiquetas: string[]
}) => {
  if (!projectStore.currentProjectId) {
    alert('Selecciona un proyecto primero.')
    return
  }
  try {
    await apiClient.post('/items', {
      ...newItemData,
      tipo: 'task',
      proyecto_id: projectStore.currentProjectId,
    })
    // Rely on socket event 'item_created' to update the list
  } catch (error) {
    console.error('Error creating task:', error)
    // TODO: Show user feedback
  }
}

const handleToggleCompletada = async (id: number) => {
  const item = allItems.value.find((t) => t.id === id)
  if (item) {
    const originalState = item.completada
    item.completada = !item.completada // Optimistic update
    try {
      await apiClient.put(`/items/${id}`, { completada: item.completada })
      // Rely on socket event 'item_updated' for final confirmation
    } catch (error) {
      console.error('Error updating task:', error)
      item.completada = originalState // Rollback
      // TODO: Show user feedback
    }
  }
}

const handleEliminarTarea = async (id: number) => {
  let index = -1
  let removedItem: Item | undefined = undefined
  try {
    // Optimistic update
    index = allItems.value.findIndex((t) => t.id === id)
    if (index !== -1) {
      removedItem = allItems.value.splice(index, 1)[0]
    }
    await apiClient.delete(`/items/${id}`)
    // Rely on socket event 'item_deleted' to confirm removal
  } catch (error) {
    console.error('Error deleting task:', error)
    // Rollback optimistic update
    if (removedItem) {
      allItems.value.splice(index, 0, removedItem)
    }
    // TODO: Show user feedback
  }
}

// --- Filter Handlers ---

const handleTagClick = (tag: string) => {
  activeTag.value = activeTag.value === tag ? null : tag
}

// --- Computed Property for Filtering ---
const filteredItems = computed(() => {
  let itemsFiltrados = allItems.value
  if (completionFilter.value === 'completed') {
    itemsFiltrados = itemsFiltrados.filter((item) => item.completada)
  } else if (completionFilter.value === 'pending') {
    itemsFiltrados = itemsFiltrados.filter((item) => !item.completada)
  }
  if (activeTag.value) {
    itemsFiltrados = itemsFiltrados.filter((item) =>
      item.etiquetas.includes(activeTag.value as string),
    )
  }
  return itemsFiltrados
})
</script>

<template>
  <div class="tareas-container">
    <h1>Mis Tareas</h1>
    <div class="status-filters">
      <button @click="setCompletionFilter('all')" :class="{ active: completionFilter === 'all' }">
        Todas
      </button>
      <button
        @click="setCompletionFilter('pending')"
        :class="{ active: completionFilter === 'pending' }"
      >
        Pendientes
      </button>
      <button
        @click="setCompletionFilter('completed')"
        :class="{ active: completionFilter === 'completed' }"
      >
        Completadas
      </button>
    </div>
    <div class="tareas-layout">
      <FormToDo @tarea-agregada="handleTareaAgregada" />

      <div class="lista-container">
        <div v-if="isLoading">Cargando...</div>
        <div v-else-if="allItems.length === 0">No tienes tareas. ¡Crea una nueva!</div>
        <ListToDo
          v-else
          :items="filteredItems"
          :activeTag="activeTag"
          @toggle-completada="handleToggleCompletada"
          @eliminar-tarea="handleEliminarTarea"
          @tag-clicked="handleTagClick"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.tareas-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: var(--color-heading);
}

/* --- Estilos Mobile First (por defecto) --- */
/* Por defecto, los elementos se apilan uno encima del otro. */
.tareas-layout {
  display: flex;
  flex-direction: column;
  gap: 2rem; /* Espacio entre el formulario y la lista */
}

/* --- Media Query para pantallas más grandes (Desktop) --- */
/* Cuando el ancho de la pantalla sea de 768px o más... */
@media (min-width: 768px) {
  .tareas-layout {
    display: grid; /* ...cambiamos a un layout de Grid. */

    /* Creamos dos columnas: la primera de 1fr y la segunda de 1.5fr.
       Esto hace que la lista de tareas sea un poco más ancha que el formulario. */
    grid-template-columns: 1fr 1.5fr;

    gap: 2rem; /* Espacio entre las columnas */
    align-items: start; /* Alinea los elementos en la parte superior de su celda */
  }
}
.status-filters {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.status-filters button {
  background-color: var(--color-surface);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.status-filters button:hover {
  background-color: var(--color-border);
}

.status-filters button.active {
  background-color: var(--color-accent);
  color: white;
  border-color: var(--color-accent);
}
</style>
