<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Item } from '@/data/DataTypes'

const props = defineProps<{
  items: Item[]
  activeTag: string | null
}>()

const emit = defineEmits(['eliminar-item', 'toggle-completada', 'tag-clicked', 'edit-item']) // 2. Define el nuevo emit

// --- LÓGICA DE CONFIRMACIÓN DE BORRADO ---
const itemAEliminarId = ref<number | null>(null)

const iniciarEliminacion = (id: number) => {
  itemAEliminarId.value = id
}

const confirmarEliminacion = () => {
  if (itemAEliminarId.value !== null) {
    emit('eliminar-item', itemAEliminarId.value)
  }
  itemAEliminarId.value = null
}

const cancelarEliminacion = () => {
  itemAEliminarId.value = null
}

// --- LÓGICA PARA FILTROS DE ETIQUETAS ---
const allTags = computed(() => {
  const tagsSet = new Set<string>()
  props.items.forEach((item) => {
    item.etiquetas.forEach((tag) => tagsSet.add(tag))
  })
  return Array.from(tagsSet)
})

// --- FUNCIÓN UTILITARIA PARA FORMATEAR FECHAS ---
// ...

const formatDate = (date: string | Date): string => {
  // Si la fecha es nula o undefined, devuelve un string vacío para no mostrar nada.
  if (!date) return ''

  const now = new Date()
  const taskDate = new Date(date)

  // Comprobamos si la fecha es válida
  if (isNaN(taskDate.getTime())) return ''

  const diffSeconds = Math.floor((now.getTime() - taskDate.getTime()) / 1000)

  if (diffSeconds < 60) return 'hace unos segundos'
  const diffMinutes = Math.floor(diffSeconds / 60)
  if (diffMinutes < 60) return `hace ${diffMinutes} min`
  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `hace ${diffHours} h`
  const diffDays = Math.floor(diffHours / 24)
  return `hace ${diffDays} día(s)`
}

// --- COLOR PRIORIDAD ---
const priorityColor = (priority: Item['prioridad']) => {
  switch (priority) {
    case 'alta':
      return '#e74c3c' // Rojo
    case 'media':
      return '#f39c12' // Naranja
    case 'baja':
      return '#3498db' // Azul
    default:
      return 'transparent' // O un gris claro como var(--color-border)
  }
}
</script>

<template>
  <div class="task-list-container">
    <div class="tag-filters" v-if="allTags.length > 0">
      <button
        v-for="tag in allTags"
        :key="tag"
        class="tag-pill"
        :class="{ active: activeTag === tag }"
        @click="emit('tag-clicked', tag)"
      >
        {{ tag }}
      </button>
    </div>

    <TransitionGroup v-if="props.items.length > 0" name="list" tag="ul" class="task-list">
      <li
        v-for="item in props.items"
        :key="item.id"
        class="task-card"
        :class="{ completada: item.completada }"
      >
        <div
          class="priority-indicator"
          :style="{ backgroundColor: priorityColor(item.prioridad) }"
        ></div>

        <input
          type="checkbox"
          class="task-checkbox"
          :checked="item.completada"
          @change="emit('toggle-completada', item.id)"
        />

        <div class="task-content">
          <p class="task-title">{{ item.titulo }}</p>
          <p v-if="item.descripcion" class="task-description">{{ item.descripcion }}</p>
          <div class="task-meta">
            <span class="task-date">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              {{ formatDate(item.fecha_actualizacion) }}
            </span>
            <div class="task-tags" v-if="item.etiquetas?.length">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"
                ></path>
                <line x1="7" y1="7" x2="7.01" y2="7"></line>
              </svg>
              <span v-for="tag in item.etiquetas" :key="tag" class="task-tag-item">{{ tag }}</span>
            </div>
          </div>
        </div>

        <div class="task-actions">
          <div v-if="itemAEliminarId === item.id" class="delete-confirm">
            <button @click="confirmarEliminacion" class="btn-confirm">Ok</button>
            <button @click="cancelarEliminacion" class="btn-cancel">X</button>
          </div>
          <button
            v-if="itemAEliminarId !== item.id"
            @click="emit('edit-item', item)"
            class="btn-action btn-edit"
            title="Editar"
          >
            ✏️
          </button>
          <button
            v-if="itemAEliminarId !== item.id"
            @click="iniciarEliminacion(item.id)"
            class="btn-action btn-eliminar"
            title="Eliminar"
          >
            🗑️
          </button>
        </div>
      </li>
    </TransitionGroup>

    <div v-else class="no-tasks-message">
      <p>No tienes tareas aquí. ¡Crea una nueva!</p>
    </div>
  </div>
</template>

<style scoped>
/* --- Filtros (sin cambios) --- */
.tag-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
}
.tag-pill {
  background-color: var(--color-surface);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 0.25rem 0.75rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}
.tag-pill:hover {
  background-color: var(--color-accent);
  color: white;
  border-color: var(--color-accent);
}
.tag-pill.active {
  background-color: var(--color-accent);
  color: white;
  border-color: var(--color-accent);
}

/* --- Lista y Transiciones --- */
/* Quitamos estilos de ul aquí, TransitionGroup lo renderiza */
.task-list {
  list-style: none; /* Asegura que ul no tenga estilos */
  padding: 0;
  margin: 0;
  padding-inline-start: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem; /* Espacio entre tarjetas */
}

/* Transiciones para añadir/eliminar */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* --- Tarjeta de Tarea --- */
.task-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: var(--color-surface);
  border-radius: 8px;
  border: 1px solid var(--color-border);
  position: relative;
  overflow: hidden;
  transition: all 0.2s ease;
}
.task-card:hover {
  border-color: var(--color-border-hover, var(--color-border));
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* --- Indicador de Prioridad --- */
.priority-indicator {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 5px;
}
/* Ajusta el padding izquierdo para compensar el indicador */
.task-card {
  padding-left: calc(1rem + 5px);
}

/* --- Checkbox --- */
.task-checkbox {
  min-width: 18px;
  height: 18px;
  accent-color: var(--color-accent);
  cursor: pointer;
}

/* --- Contenido --- */
.task-content {
  flex-grow: 1;
  overflow: hidden;
}

.task-title {
  margin: 0;
  font-weight: 500;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.task-description {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  margin: 0.25rem 0 0.5rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.task-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 1rem;
  font-size: 0.8rem;
  color: var(--color-text-secondary);
}
.task-date,
.task-tags {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}
.task-meta svg {
  flex-shrink: 0;
}

.task-tags {
  display: flex;
  gap: 0.5rem;
}
.task-tag-item {
  background-color: var(--color-background); /* Ligeramente diferente para contraste */
  padding: 0.15rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem; /* Un poco más pequeño */
}

/* --- Acciones (Ocultas por defecto, visibles al hover) --- */
.task-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.2s ease;
}
.task-card:hover .task-actions {
  opacity: 1;
}

.btn-action {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem; /* Ajusta según el tamaño de tu icono */
}
.btn-action:hover {
  background-color: var(--color-border);
}
.btn-eliminar:hover {
  color: #e53e3e; /* Rojo para eliminar */
}
.btn-edit:hover {
  color: var(--color-accent);
}

.delete-confirm {
  display: flex;
  gap: 0.5rem;
}
.btn-confirm {
  background-color: #e53e3e;
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}
.btn-cancel {
  background-color: var(--color-border);
  color: var(--color-text-primary);
  border: none;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

/* --- Estado Completado --- */
.task-card.completada {
  opacity: 0.7;
  background-color: #2e473b1a;
}
.task-card.completada .task-title,
.task-card.completada .task-description {
  text-decoration: line-through;
  opacity: 0.8;
}

/* --- Mensaje No Tareas --- */
.no-tasks-message {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-secondary);
}
</style>
