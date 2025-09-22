<script lang="ts" setup>
import { ref } from 'vue'

const descripcion = ref<string>('')
const emit = defineEmits(['tarea-agregada'])

const agregarTarea = () => {
  if (descripcion.value.trim() !== '') {
    emit('tarea-agregada', descripcion.value.trim())
    descripcion.value = ''
  }
}
</script>

<template>
  <article class="todo-form">
    <h1>Agregar tarea</h1>
    <form action="#" @submit.prevent="agregarTarea">
      <input type="text" v-model="descripcion" placeholder="Nueva tarea" />
      <button class="btn-agregar" type="submit">Agregar</button>
    </form>
  </article>
</template>

<style scoped>
.todo-form {
  max-width: 400px;
  margin: 1rem auto;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}
input {
  width: 100%;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: transparent;
  color: #949494;
  font-size: medium;
}
.btn-agregar {
  padding: 0.5rem 1rem;
  border: none;
  background-color: #28a745;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  margin: 0.5rem auto;
}
.btn-agregar:hover {
  background-color: #218838;
}
form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
h1 {
  text-align: center;
  color: #333;
  margin-bottom: 1rem;
  font-weight: 700;
}
</style>
