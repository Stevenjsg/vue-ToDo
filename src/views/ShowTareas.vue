<script setup lang="ts">
import { ref, onMounted, computed} from 'vue'
import apiClient from '@/services/api' // Importa nuestro servicio
import type { Tarea } from '@/data/DataTypes'
import FormToDo from '@/components/FormToDo.vue'
import ListToDo from '@/components/ListToDo.vue'

const tareas = ref<Tarea[]>([])
const activeTag = ref<string | null>(null);
const isLoading = ref(true)

// 👇 1. NUEVO ESTADO PARA EL FILTRO DE COMPLETADO
const completionFilter = ref<'all' | 'completed' | 'pending'>('all');

const setCompletionFilter = (filter: 'all' | 'completed' | 'pending') => {
  completionFilter.value = filter;
};

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

const handleToggleCompletada = async (id: number) => {
  // 1. Búsqueda y Actualización Optimista
  const tarea = tareas.value.find(t => t.id === id);
  if (tarea) {
    // Cambiamos el estado en el frontend al instante para una mejor UX
    tarea.completada = !tarea.completada; 
    
    // 2. Llamada a la API para persistir el cambio
    try {
      await apiClient.put(`/tareas/${id}`, { completada: tarea.completada });
    } catch (error) {
      console.error('Error al actualizar la tarea:', error);
      // Si la API falla, revertimos el cambio en el frontend
      tarea.completada = !tarea.completada; 
    }
  }
};

// 2. Nueva función para manejar el clic en un tag
const handleTagClick = (tag: string) => {
  // Si se hace clic en el tag ya activo, se desactiva el filtro
  if (activeTag.value === tag) {
    activeTag.value = null;
  } else {
    activeTag.value = tag;
  }
};

// 3. Propiedad computada que filtra las tareas
const filteredTareas = computed(() => {
  let tareasFiltradas = tareas.value;

  // --- PRIMER FILTRO: Por estado de completado ---
  if (completionFilter.value === 'completed') {
    tareasFiltradas = tareasFiltradas.filter(tarea => tarea.completada);
  } else if (completionFilter.value === 'pending') {
    tareasFiltradas = tareasFiltradas.filter(tarea => !tarea.completada);
  }
  // Si es 'all', no hacemos nada y pasamos todas las tareas.

  // --- SEGUNDO FILTRO: Por etiqueta (tag) ---
  if (activeTag.value) {
    tareasFiltradas = tareasFiltradas.filter(tarea => 
      tarea.etiquetas.includes(activeTag.value as string)
    );
  }

  return tareasFiltradas;
});

const handleEliminarTarea = async (id: number) => {
  try {
    await apiClient.delete(`/tareas/${id}`)
    // Después de eliminar, recarga la lista de tareas
    await fetchTareas()
  } catch (error) {
    console.error('Error al eliminar la tarea:', error)
  }
}
</script>

<template>
  <div class="tareas-container">
    <h1>Mis Tareas</h1>
     <div class="status-filters">
      <button 
        @click="setCompletionFilter('all')" 
        :class="{ 'active': completionFilter === 'all' }"
      >
        Todas
      </button>
      <button 
        @click="setCompletionFilter('pending')" 
        :class="{ 'active': completionFilter === 'pending' }"
      >
        Pendientes
      </button>
      <button 
        @click="setCompletionFilter('completed')" 
        :class="{ 'active': completionFilter === 'completed' }"
      >
        Completadas
      </button>
    </div>
    <div class="tareas-layout">
      <FormToDo @tarea-agregada="handleTareaAgregada" />

      <div class="lista-container">
        <div v-if="isLoading">Cargando...</div>
        <div v-else-if="tareas.length === 0">No tienes tareas.</div>
        <ListToDo 
          v-else 
          :tareas="filteredTareas" 
          :activeTag="activeTag"
          @toggle-completada="handleToggleCompletada"
          @eliminar-tarea="handleEliminarTarea"
          @tag-clicked="handleTagClick"
        />
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
.status-filters {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.status-filters button {
  background-color: var(--color-surface);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.status-filters button:hover {
  background-color: var(--color-border);
}

.status-filters button.active {
  background-color: var(--color-accent);
  color: white;
  border-color: var(--color-accent);
}
</style>
