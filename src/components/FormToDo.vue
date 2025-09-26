<script lang="ts" setup>
import { ref, computed } from 'vue'

// --- ESTADO DEL FORMULARIO ---
const descripcion = ref<string>('')
const prioridad = ref<string>('media') // Prioridad por defecto
const tags = ref<string[]>([])
const etiquetaActual = ref<string>('')
const mostrarInputTags = ref<boolean>(false)

// --- DATOS PARA EL SELECT ---
const prioridades = [
  { value: 'alta', text: 'Alta', color: '#e74c3c' },
  { value: 'media', text: 'Media', color: '#f39c12' },
  { value: 'baja', text: 'Baja', color: '#3498db' },
]
const colorPrioridadSeleccionada = computed(() => {
  const prioridadActual = prioridades.find((p) => p.value === prioridad.value)
  return prioridadActual ? prioridadActual.color : '#ccc' // Devuelve un color por defecto
})

const emit = defineEmits(['tarea-agregada'])

// --- LÓGICA DE LAS ETIQUETAS ---
const agregarEtiqueta = () => {
  if (etiquetaActual.value.trim() !== '' && !tags.value.includes(etiquetaActual.value.trim())) {
    tags.value.push(etiquetaActual.value.trim())
    etiquetaActual.value = ''
  }
}

const eliminarEtiqueta = (index: number) => {
  tags.value.splice(index, 1)
}

// --- LÓGICA DEL FORMULARIO PRINCIPAL ---
const agregarTarea = () => {
  if (descripcion.value.trim() !== '') {
    // Emitimos un objeto con todos los datos de la nueva tarea
    emit('tarea-agregada', {
      descripcion: descripcion.value.trim(),
      prioridad: prioridad.value,
      etiquetas: tags.value,
    })

    // Reseteamos el formulario
    descripcion.value = ''
    prioridad.value = 'media'
    tags.value = []
    etiquetaActual.value = ''
    mostrarInputTags.value = false
  }
}
</script>

<template>
  <article class="todo-form">
    <h1>Agregar tarea</h1>
    <form action="#" @submit.prevent="agregarTarea">
      <div class="form-group">
        <input
          class="input-descripcion"
          type="text"
          v-model="descripcion"
          placeholder="Nueva tarea"
          required
        />

        <select
          class="input-prioridad"
          v-model="prioridad"
          :style="{ color: colorPrioridadSeleccionada, borderColor: colorPrioridadSeleccionada }"
        >
          <option
            v-for="p in prioridades"
            :key="p.value"
            :value="p.value"
            :style="{ color: p.color }"
          >
            ● {{ p.text }}
          </option>
        </select>
      </div>

      <div class="tags-section">
        <div class="tag-list">
          <span v-for="(tag, index) in tags" :key="index" class="tag-item">
            {{ tag }}
            <button type="button" @click="eliminarEtiqueta(index)">×</button>
          </span>
        </div>

        <div v-if="mostrarInputTags" class="tag-input-group">
          <input
            type="text"
            v-model="etiquetaActual"
            placeholder="Añadir etiqueta..."
            @keydown.enter.prevent="agregarEtiqueta"
          />
          <button type="button" class="btn-add-tag" @click="agregarEtiqueta">Añadir</button>
        </div>

        <button type="button" class="btn-show-tags" @click="mostrarInputTags = !mostrarInputTags">
          + Tags
        </button>
      </div>

      <button class="btn-agregar" type="submit">Agregar Tarea</button>
    </form>
  </article>
</template>

<style scoped>
.todo-form {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

h1 {
  text-align: center;
  color: var(--color-text-primary);
  margin-top: 0;
  margin-bottom: 1rem;
  font-weight: 700;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  gap: 1rem;
}

.input-descripcion,
.input-prioridad,
.tag-input-group input {
  background-color: var(--color-background);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 0.75rem;
  font-size: 1rem;
}

.input-descripcion {
  flex-grow: 1;
}

input::placeholder {
  color: var(--color-text-secondary);
}

.tags-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  min-height: 24px; /* Evita que el layout salte cuando no hay tags */
}

.tag-item {
  display: flex;
  align-items: center;
  background-color: var(--color-border);
  color: var(--color-text-primary);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
}

.tag-item button {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  margin-left: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  padding: 0;
}

.tag-input-group {
  display: flex;
  gap: 0.5rem;
}

.btn-add-tag {
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-border);
  background-color: var(--color-background);
  color: var(--color-text-primary);
  border-radius: 4px;
  cursor: pointer;
}

.btn-show-tags {
  align-self: flex-start;
  background: none;
  border: none;
  color: var(--color-accent);
  cursor: pointer;
  padding: 0.25rem 0;
  font-weight: 500;
}

.btn-agregar {
  padding: 0.75rem 1.5rem;
  border: none;
  background-color: var(--color-accent);
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.2s;
}
.btn-agregar:hover {
  background-color: var(--color-accent-hover);
}
</style>
