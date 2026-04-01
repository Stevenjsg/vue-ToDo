<script lang="ts" setup>
import { ref } from 'vue'

const emit = defineEmits(['recordatorio-agregado'])

const titulo = ref<string>('')
const descripcion = ref<string>('')
const fecha = ref<string>('')

const agregarRecordatorio = () => {
  if (titulo.value.trim() !== '' && fecha.value !== '') {
    emit('recordatorio-agregado', {
      titulo: titulo.value.trim(),
      descripcion: descripcion.value.trim(),
      fecha: fecha.value,
    })
    titulo.value = ''
    descripcion.value = ''
    fecha.value = ''
  }
}
</script>
<template>  
  <form @submit.prevent="agregarRecordatorio" class="reminder-form">
    <div class="form-group">
      <label for="titulo">Título:</label>
      <input id="titulo" v-model="titulo" type="text" required />
    </div>

    <div class="form-group">
      <label for="descripcion">Descripción:</label>
      <textarea id="descripcion" v-model="descripcion"></textarea>
    </div>

    <div class="form-group">
      <label for="fecha">Fecha y hora:</label>
      <input id="fecha" v-model="fecha" type="datetime-local" required />
    </div>

    <button type="submit">Agregar Recordatorio</button>
  </form>
  </template>
<style scoped>
.reminder-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}
label {
    font-weight: bold;
}
input[type="text"],
textarea,
input[type="datetime-local"] {
    padding: 0.5rem;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    font-size: 1rem;
    background-color: var(--color-background);
    color: var(--color-text-primary);
}
button {
    padding: 0.75rem;
    background-color: var(--color-accent);
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
}
button:hover {
    background-color: var(--color-accent-hover);
}
</style>