<script setup lang="ts">
// Importa los composables y stores necesarios
import { computed, defineProps, ref, toRef } from 'vue'
import { useProjectStore, type Project } from '@/stores/projects'
import { useRealtimeItems } from '@/composables/useRealtimeItems'
import { useItemFilters } from '@/composables/useItemFilters'
import apiClient from '@/services/api'
import FormToDo from '@/components/FormToDo.vue'
import ListToDo from '@/components/ListToDo.vue'
import type { Item } from '@/data/DataTypes'
import BaseModal from '@/components/common/BaseModal.vue'
import EditTaskForm from '@/components/EditTaskForm.vue'

const projectStore = useProjectStore()
const showAddTaskModal = ref(false)
const showEditModal = ref(false)
const itemToEdit = ref<Item | null>(null)

const props = defineProps<{
  projectId: number | null // Recibe null de la ruta 'PersonalTasks' o number de 'ProjectTasks'
}>()
const requestEditItem = (item: Item) => {
  itemToEdit.value = item // Guarda el item completo
  showEditModal.value = true
}
const reactiveProjectId = toRef(props, 'projectId')

// --- USA LOS COMPOSABLES ---
// 1. Obtiene la lista reactiva de items y el estado de carga
const { items: allItems, isLoading } = useRealtimeItems(reactiveProjectId)
// 2. Obtiene los filtros y la lista filtrada, pasándole la lista del primer composable
const { activeTag, completionFilter, setCompletionFilter, handleTagClick, filteredItems } =
  useItemFilters(allItems)

const pageTitle = computed(() => {
  if (props.projectId === null) return 'Mis Tareas'
  // 👇 No uses .value aquí y añade el tipo para 'p' 👇
  const project = projectStore.projectList.find((p: Project) => p.id === props.projectId)
  return project?.nombre || 'Proyecto'
})

// --- Handlers que llaman a la API (la lógica de socket ya no está aquí) ---
const handleTareaAgregada = async (newItemData: {
  titulo: string
  descripcion?: string
  prioridad: string
  etiquetas: string[]
}) => {
  try {
    await apiClient.post('/items', {
      ...newItemData,
      tipo: 'task',
      proyecto_id: props.projectId,
    })
    // Rely on socket event 'item_created' to update the list
    showAddTaskModal.value = false
  } catch (error) {
    console.error('Error creating task:', error)
    // TODO: Show user feedback
  }
}

const handleToggleCompletada = async (id: number) => {
  // Encuentra el item en la lista local
  const item = allItems.value.find((t) => t.id === id)
  if (item) {
    // Guarda el estado original para posible rollback
    const originalState = item.completada
    // Actualización optimista: cambia el estado en la UI inmediatamente
    item.completada = !item.completada

    try {
      // Llama a la API para persistir el cambio
      await apiClient.put(`/items/${id}`, { completada: item.completada })
      // Confía en el evento 'item_updated' del socket para la confirmación final
      // (No necesitas hacer nada más aquí si el socket funciona)
    } catch (error) {
      console.error('Error al actualizar la tarea:', error)
      // Rollback: Si la API falla, revierte el cambio en la UI
      item.completada = originalState
      // TODO: Mostrar un mensaje de error al usuario
    }
  }
}

// Función que se llama cuando se CONFIRMA en el modal
const handleEliminarItem = async (id: number) => {
  let index = -1
  let removedItem: Item | undefined = undefined
  try {
    // Actualización optimista (opcional pero recomendado)
    index = allItems.value.findIndex((t) => t.id === id)
    if (index !== -1) {
      removedItem = allItems.value.splice(index, 1)[0]
    }

    // Llama a la API para eliminar
    await apiClient.delete(`/items/${id}`)

    // Confía en el evento 'item_deleted' del socket para la confirmación final y
    // la actualización en otras pestañas. La UI actual ya se actualizó optimísticamente.
  } catch (error) {
    console.error('Error deleting item:', error)
    // Rollback si la API falla
    if (removedItem !== undefined && index !== -1) {
      allItems.value.splice(index, 0, removedItem)
    }
    // TODO: Mostrar un mensaje de error al usuario
  }
  // No necesitamos limpiar estado del modal aquí
}
const handleUpdateFromForm = async (updatedData: {
  titulo: string
  descripcion: string
  prioridad: Item['prioridad']
  etiquetas: string[]
}) => {
  if (!itemToEdit.value) return // Seguridad

  const idToUpdate = itemToEdit.value.id

  // Actualización optimista (opcional pero recomendado)
  const index = allItems.value.findIndex((t) => t.id === idToUpdate)
  let originalData = {} // Para rollback
  if (index !== -1) {
    originalData = { ...allItems.value[index] } // Copia superficial
    Object.assign(allItems.value[index], updatedData) // Aplica cambios
  }

  try {
    // Llama a la API PUT /items/:id con los nuevos datos
    await apiClient.put(`/items/${idToUpdate}`, updatedData)
    showEditModal.value = false // Cierra el modal si la API tiene éxito
    // El evento de socket 'item_updated' confirmará/refinará el cambio
  } catch (error) {
    console.error('Error updating task from form:', error)
    // Rollback si la API falla
    if (index !== -1) {
      Object.assign(allItems.value[index], originalData) // Restaura datos originales
    }
    // TODO: Mostrar error al usuario en el modal o con notificación
  }
}
</script>

<template>
  <div class="tareas-container">
    <header class="header-actions">
      <h1>{{ pageTitle }}</h1>
      <button @click="showAddTaskModal = true" class="btn-add-task">+ Añadir Tarea</button>
    </header>

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

    <div class="lista-container">
      <div v-if="isLoading">Cargando...</div>
      <div v-else-if="allItems.length === 0">
        No tienes tareas en {{ projectStore.activeProject?.nombre || 'tu lista personal' }}.
      </div>
      <ListToDo
        v-else
        :items="filteredItems"
        :activeTag="activeTag"
        @toggle-completada="handleToggleCompletada"
        @eliminar-item="handleEliminarItem"
        @tag-clicked="handleTagClick"
        @edit-item="requestEditItem"
      />
    </div>
    <BaseModal v-model:visible="showAddTaskModal" title="Agregar Nueva Tarea">
      <FormToDo @tarea-agregada="handleTareaAgregada" />
    </BaseModal>
    <BaseModal v-model:visible="showEditModal" title="Editar Tarea">
      <EditTaskForm
        v-if="itemToEdit"
        :item="itemToEdit"
        @update-task="handleUpdateFromForm"
        @cancel="showEditModal = false"
      />
    </BaseModal>
  </div>
</template>

<style scoped>
.tareas-container {
  max-width: 900px; /* Ajusta según prefieras */
  margin: 0 auto;
  padding: 1rem;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

h1 {
  /* text-align: center; Ya no es necesario */
  margin: 0; /* Quitamos márgenes extra */
  color: var(--color-heading);
}

.btn-add-task {
  /* Reutiliza tu estilo .btn-primary o crea uno nuevo */
  background-color: var(--color-accent);
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-add-task:hover {
  background-color: var(--color-accent-hover);
}

.status-filters {
  display: flex;
  justify-content: flex-start; /* Alineados a la izquierda ahora */
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
@media (min-width: 768px) {
  .tareas-container {
    padding: 2rem; /* Más padding en escritorio */
  }

  .header-actions {
    flex-direction: row; /* Lado a lado en escritorio */
    justify-content: space-between; /* Título a la izq, botón a la der */
    align-items: center; /* Alineados verticalmente */
  }

  h1 {
    font-size: 2.2rem; /* Título más grande en escritorio */
  }

  .status-filters {
    justify-content: flex-start; /* Mantenemos a la izquierda o centramos si prefieres */
    gap: 1rem; /* Más espacio */
  }
}
</style>
