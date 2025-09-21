<script setup lang="ts">
const props = defineProps<{
  tareas: string[]
}>()
const emit = defineEmits(['tarea-eliminada'])
</script>

<template>
  <div class="todo-list">
    <h2>Lista de Tareas:</h2>
    <ul v-if="props.tareas.length > 0">
      <li v-for="(tarea, index) in props.tareas" :key="index">
        {{ tarea }}
        <button @click="emit('tarea-eliminada', index)">Eliminar</button>
      </li>
    </ul>
    <p v-else>No hay tareas agregadas.</p>
  </div>
</template>

<style scoped>
.todo-list {
  margin-top: 2rem;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
}
ul {
  list-style: none;
  padding: 0;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}
</style>
