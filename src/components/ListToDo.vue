<script setup lang="ts">
import type { Tarea } from '@/data/DataTypes'

const props = defineProps<{
  tareas: Tarea[]
}>()
const emit = defineEmits(['tarea-eliminada', 'toggle-completed'])
</script>

<template>
  <div class="todo-list">
    <h2>Lista de Tareas</h2>
    <ul v-if="props.tareas.length > 0">
      <li v-for="(tarea, index) in props.tareas" :key="index">
        <input
          type="checkbox"
          :checked="tarea.completada"
          @change="emit('toggle-completed', tarea.id)"
        />
        <span :class="{ completada: tarea.completada }">
          {{ tarea.descripcion }}
        </span>
        <button class="btn-eliminar" @click="emit('tarea-eliminada', index)">Eliminar</button>
      </li>
    </ul>
    <p v-else>No hay tareas agregadas.</p>
  </div>
</template>

<style scoped>
.completada {
  text-decoration: line-through;
  opacity: 0.6;
  color: var(--color-ascent);
}
.todo-list {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
ul {
  list-style: none;
  padding: 0;
}
span {
  flex-grow: 1; /* El texto ocupa el espacio sobrante */
}
li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--color-border);
  gap: 0.5rem;
}
.btn-eliminar {
  background-color: var(--color-danger);
  color: var(--color-text-primary);
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
}
.btn-eliminar:hover {
  background-color: var(--color-danger-hover);
}
p {
  color: var(--color-text-secondary);
}
h2 {
  text-align: center;
  color: var(--color-text-primary);
  margin-bottom: 1rem;
  font-weight: 700;
}
</style>
