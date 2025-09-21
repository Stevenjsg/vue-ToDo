<script setup lang="ts">
import { RouterView } from 'vue-router'
import { ref } from 'vue'
import FormToDo from './components/FormToDo.vue'
import ListToDo from './components/ListToDo.vue'

const tareas = ref<string[]>(['Aprender Vue 3', 'Aprender TypeScript'])
const handleAgregarTarea = (tarea: string) => {
  tareas.value.push(tarea)
}
const handleEliminarTarea = (index: number) => {
  tareas.value.splice(index, 1)
}
</script>

<template>
  <div class="todo-app">
    <h1>Lista para agregar tareas</h1>
    <FormToDo @tarea-agregada="handleAgregarTarea" />
    <ListToDo :tareas="tareas" @tarea-eliminada="handleEliminarTarea" />
  </div>
  <RouterView />
</template>

<style scoped>
.todo-app {
  max-width: 400px;
  margin: 2rem auto;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 4px 6px rgba(255, 255, 255, 0.1);
}
</style>
