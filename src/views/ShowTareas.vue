<script setup lang="ts">
import { ref, onMounted } from 'vue'
import apiClient from '@/services/api' // Importa nuestro servicio
import type { Tarea } from '@/data/DataTypes'

const tareas = ref<Tarea[]>([])
const isLoading = ref(true)

const fetchTareas = async () => {
  try {
    const response = await apiClient.get('/tareas')
    tareas.value = response.data
  } catch (error) {
    console.error('Error al obtener las tareas:', error)
    // Aquí podrías manejar el error (ej. si el token expiró, redirigir al login)
  } finally {
    isLoading.value = false
  }
}

// Llama a la función para obtener las tareas cuando el componente se monta
onMounted(fetchTareas)
</script>

<template>
  <div>
    <h1>Mis Tareas</h1>
    <div v-if="isLoading">Cargando...</div>
    <ListToDo v-else :tareas="tareas" />
  </div>
</template>
