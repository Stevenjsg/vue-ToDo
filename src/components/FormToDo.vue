<script lang="ts" setup>
import { ref } from 'vue'

const nuevaTarea = ref('')
const emit = defineEmits(['tarea-agregada'])

const agregarTarea = () => {
  if (nuevaTarea.value.trim() !== '') {
    emit('tarea-agregada', nuevaTarea.value.trim())
    nuevaTarea.value = ''
  }
}
</script>

<template>
  <article class="todo-form">
    <h1>Agregar tarea</h1>
  </article>
  <form action="#" @submit.prevent="agregarTarea">
    <input type="text" v-model="nuevaTarea" placeholder="Nueva tarea" />
    <button type="submit">Agregar</button>
  </form>
</template>

<style scoped>
.todo-form {
  max-width: 400px;
  margin: 2rem auto;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}
input {
  width: 70%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  padding: 0.5rem 1rem;
  border: none;
  background-color: #28a745;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 1rem;
}
</style>
