<script setup lang="ts">
import { RouterView } from 'vue-router'
import { ref } from 'vue'
import type { Tarea } from './data/DataTypes'
import FormToDo from './components/FormToDo.vue'
import ListToDo from './components/ListToDo.vue'

const KEY_LOCAL = 'tareas-vue'
import { saveLocal, readLocal } from './lib/saveLocal'

const tareas = ref<Tarea[]>(readLocal(KEY_LOCAL))

const handleAgregarTarea = (descripcion: string) => {
  const nuevaTarea: Tarea = {
    id: Date.now(),
    descripcion: descripcion,
    completada: false,
    fechaCreacion: new Date(),
    fechaModificacion: new Date(),
    prioridad: 'media',
    etiquetas: [],
  }
  console.log('Nueva tarea agregada:', nuevaTarea)
  saveLocal(KEY_LOCAL, nuevaTarea)
  tareas.value.push(nuevaTarea)
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
  box-shadow: 0 0 15px 5px rgba(255, 255, 255, 0.2);
}
h1 {
  text-align: center;
  margin-bottom: 1rem;
  font-weight: 800;
}
</style>
