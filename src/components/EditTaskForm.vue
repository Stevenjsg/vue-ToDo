<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { Item } from '@/data/DataTypes'

// Recibe el item a editar como prop
const props = defineProps<{
  item: Item
}>()

const emit = defineEmits(['update-task', 'cancel'])

// Estado local del formulario, inicializado con los props
const titulo = ref(props.item.titulo)
const descripcion = ref(props.item.descripcion || '')
const prioridad = ref(props.item.prioridad || 'media')
const tags = ref([...props.item.etiquetas]) // Copia para no mutar prop
const etiquetaActual = ref('')
const mostrarInputTags = ref(false)

// Recargar el estado si el item de la prop cambia (por si editas otro item sin cerrar el modal)
watch(
  () => props.item,
  (newItem) => {
    titulo.value = newItem.titulo
    descripcion.value = newItem.descripcion || ''
    prioridad.value = newItem.prioridad || 'media'
    tags.value = [...newItem.etiquetas]
  },
  { immediate: true },
) // immediate: true para carga inicial

// --- Lógica de Prioridad y Tags (igual que en FormToDo) ---
const prioridades = [
  { value: 'alta', text: 'Alta', color: '#e74c3c' },
  { value: 'media', text: 'Media', color: '#f39c12' },
  { value: 'baja', text: 'Baja', color: '#3498db' },
]
const colorPrioridadSeleccionada = computed(() => {
  const prioridadActual = prioridades.find((p) => p.value === prioridad.value)
  return prioridadActual ? prioridadActual.color : '#ccc'
})

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

// --- Lógica de Envío ---
const handleSubmit = () => {
  if (titulo.value.trim() !== '') {
    emit('update-task', {
      // Devuelve solo los campos que pueden cambiar
      titulo: titulo.value.trim(),
      descripcion: descripcion.value.trim(),
      prioridad: prioridad.value,
      etiquetas: tags.value,
    })
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="modal-form-content">
    <div class="form-field">
      <label for="edit-task-title">Título</label>
      <input id="edit-task-title" type="text" v-model="titulo" required />
    </div>

    <div class="form-field">
      <label for="edit-task-description">Descripción</label>
      <textarea id="edit-task-description" v-model="descripcion" rows="3"></textarea>
    </div>

    <div class="form-field">
      <label for="edit-task-priority">Prioridad</label>
      <select
        id="edit-task-priority"
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
      <label>Etiquetas</label>
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

    <div class="form-actions">
      <button type="button" class="btn-secondary" @click="emit('cancel')">Cancelar</button>
      <button type="submit" class="btn-primary">Actualizar Tarea</button>
    </div>
  </form>
</template>

<style scoped>
/* Quitamos .todo-form y h1 */

/* Ajustamos el form principal */
.modal-form-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem; /* Espaciado entre secciones del formulario */
}

/* Estilo para cada grupo de label + input */
.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.form-field label {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text-secondary);
}

/* Mantenemos estilos de inputs, select, botones, tags */
.input-titulo, /* Renombrado para claridad */
.input-descripcion, /* Nuevo textarea */
.input-prioridad,
.tag-input-group input {
  background-color: var(--color-background);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 0.75rem;
  font-size: 1rem;
  width: 100%; /* Asegura que ocupen el ancho */
  box-sizing: border-box;
}
.input-descripcion {
  /* Estilo específico para textarea si es necesario */
  resize: vertical; /* Permite redimensionar verticalmente */
}

input::placeholder,
textarea::placeholder {
  color: var(--color-text-secondary);
}

.tags-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.tags-section label {
  /* Etiqueta para la sección */
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  margin-bottom: -0.25rem; /* Ajuste visual */
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
  margin-top: 1rem;
}
.btn-agregar:hover {
  background-color: var(--color-accent-hover);
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}
.form-actions button {
  /* Estilos base botones */
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}
.btn-secondary {
  /* Estilos botón cancelar */
  background-color: var(--color-border);
  color: var(--color-text-primary);
}
.btn-primary {
  /* Estilos botón actualizar */
  background-color: var(--color-accent);
  color: white;
}
</style>
