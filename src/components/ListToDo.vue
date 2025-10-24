<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Item } from '@/data/DataTypes'

const props = defineProps<{
  items: Item[]
  activeTag: string | null
}>()

const emit = defineEmits(['eliminar-item', 'toggle-completada', 'tag-clicked']) // 2. Define el nuevo emit

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

// ...
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

    <ul v-if="props.items.length > 0" class="task-list">
      <li
        v-for="item in props.items"
        :key="item.id"
        class="task-item"
        :class="{ completada: item.completada }"
      >
        <input
          type="checkbox"
          class="task-checkbox"
          :checked="item.completada"
          @change="emit('toggle-completada', item.id)"
        />

        <div class="task-content">
          <p class="task-description">{{ item.descripcion }}</p>
          <div class="task-meta">
            <span class="task-date">{{ formatDate(item.fecha_actualizacion) }}</span>
            <div class="task-tags">
              <span v-for="tag in item.etiquetas" :key="tag" class="task-tag-item">{{ tag }}</span>
            </div>
          </div>
        </div>

        <div class="task-actions">
          <div v-if="itemAEliminarId === item.id" class="delete-confirm">
            <button @click="confirmarEliminacion" class="btn-confirm">Ok</button>
            <button @click="cancelarEliminacion" class="btn-cancel">X</button>
          </div>
          <button v-else @click="iniciarEliminacion(item.id)" class="btn-eliminar">🗑️</button>
        </div>
      </li>
    </ul>

    <div v-else class="no-tasks-message">
      <p>No tienes items pendientes. ¡Felicidades o a crear una nueva!</p>
    </div>
  </div>
</template>

<style scoped>
.task-list-container {
  width: 100%;
}

/* --- Filtros de Etiquetas --- */
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

/* --- Lista de items --- */
.task-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: var(--color-surface);
  border-radius: 8px;
  border: 1px solid var(--color-border);
  transition: all 0.3s;
}
.task-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* --- Checkbox --- */
.task-checkbox {
  min-width: 20px;
  height: 20px;
  accent-color: var(--color-accent);
}

/* --- Contenido de la item --- */
.task-content {
  flex-grow: 1;
}

.task-description {
  margin: 0 0 0.5rem 0;
  font-weight: 500;
  color: var(--color-text-primary);
}

.task-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.8rem;
  color: var(--color-text-secondary);
}

.task-tags {
  display: flex;
  gap: 0.5rem;
}

.task-tag-item {
  background-color: var(--color-background);
  padding: 0.15rem 0.5rem;
  border-radius: 12px;
}

/* --- Acciones de la item --- */
.task-actions {
  min-width: 80px;
  text-align: right;
}

.btn-eliminar {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0.5rem;
  border-radius: 50%;
  width: 40px;
  height: 40px;
}
.btn-eliminar:hover {
  background-color: #e53e3e20;
  color: #e53e3e;
}

.delete-confirm {
  display: flex;
  gap: 0.5rem;
}
.btn-confirm,
.btn-cancel {
  border: none;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}
.btn-confirm {
  background-color: #e53e3e;
  color: white;
}
.btn-cancel {
  background-color: var(--color-border);
  color: var(--color-text-primary);
}

/* --- Estado Completado --- */
.task-item.completada {
  opacity: 0.6;
}

.task-item.completada .task-description {
  text-decoration: line-through;
}

/* --- Mensaje de No items --- */
.no-tasks-message {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-secondary);
}
.tag-pill.active {
  background-color: var(--color-accent);
  color: white;
  border-color: var(--color-accent);
}
</style>
