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
  color: green;
}
.todo-list {
  margin-top: 1.5rem;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
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
  border-bottom: 1px solid #eee;
  gap: 0.5rem;
}
.btn-eliminar {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
}
.btn-eliminar:hover {
  background-color: #c82333;
}
p {
  color: #666;
}
h2 {
  text-align: center;
  color: #333;
  margin-bottom: 1rem;
  font-weight: 700;
}
</style>
