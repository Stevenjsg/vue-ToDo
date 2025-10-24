<script setup lang="ts">
// Importa los composables y stores necesarios
import { computed, defineProps, toRef } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useProjectStore, type Project } from '@/stores/projects'
import { useRealtimeItems } from '@/composables/useRealtimeItems'
import { useItemFilters } from '@/composables/useItemFilters'
import apiClient from '@/services/api'
import FormToDo from '@/components/FormToDo.vue'
import ListToDo from '@/components/ListToDo.vue'
import type { Item } from '@/data/DataTypes'

const authStore = useAuthStore()
const projectStore = useProjectStore()
const props = defineProps<{
  projectId: number | null // Recibe null de la ruta 'PersonalTasks' o number de 'ProjectTasks'
}>()

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
</script>

<template>
  <div class="tareas-container">
    <h1>{{ pageTitle }}</h1>

    <div
      v-if="!projectStore.currentProjectId && !projectStore.isLoading && authStore.isAuthenticated"
    ></div>

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
