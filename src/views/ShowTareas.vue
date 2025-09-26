<script setup lang="ts">
import { ref, onMounted } from 'vue'
import apiClient from '@/services/api' // Importa nuestro servicio
import type { Tarea } from '@/data/DataTypes'
import FormToDo from '@/components/FormToDo.vue'
import ListToDo from '@/components/ListToDo.vue'

const tareas = ref<Tarea[]>([])
const isLoading = ref(true)

const fetchTareas = async () => {
  try {
    isLoading.value = true
    const response = await apiClient.get('/tareas')
    tareas.value = response.data
  } catch (error) {
    console.error('Error al obtener las tareas:', error)
  } finally {
    isLoading.value = false
  }
}

// Llama a la función para obtener las tareas cuando el componente se monta
onMounted(fetchTareas)

const handleTareaAgregada = async (nuevaTareaData: {
  descripcion: string
  prioridad: string
  etiquetas: string[]
}) => {
  try {
    // Llamamos al endpoint del backend para crear la tarea
    await apiClient.post('/tareas', nuevaTareaData)

    // Si la creación es exitosa, volvemos a cargar la lista de tareas para
    // que la nueva aparezca inmediatamente.
    await fetchTareas()
  } catch (error) {
    console.error('Error al crear la tarea:', error)
  }
}
</script>

<template>
  <div class="tareas-container">
    <h1>Mis Tareas</h1>

    <div class="tareas-layout">
      <FormToDo @tarea-agregada="handleTareaAgregada" />

      <div class="lista-container">
        <div v-if="isLoading">Cargando...</div>
        <div v-else-if="tareas.length === 0">No tienes tareas. ¡Crea una nueva!</div>
        <ListToDo v-else :tareas="tareas" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.tareas-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: var(--color-heading);
}

/* --- Estilos Mobile First (por defecto) --- */
/* Por defecto, los elementos se apilan uno encima del otro. */
.tareas-layout {
  display: flex;
  flex-direction: column;
  gap: 2rem; /* Espacio entre el formulario y la lista */
}

/* --- Media Query para pantallas más grandes (Desktop) --- */
/* Cuando el ancho de la pantalla sea de 768px o más... */
@media (min-width: 768px) {
  .tareas-layout {
    display: grid; /* ...cambiamos a un layout de Grid. */

    /* Creamos dos columnas: la primera de 1fr y la segunda de 1.5fr.
       Esto hace que la lista de tareas sea un poco más ancha que el formulario. */
    grid-template-columns: 1fr 1.5fr;

    gap: 2rem; /* Espacio entre las columnas */
    align-items: start; /* Alinea los elementos en la parte superior de su celda */
  }
}
</style>
