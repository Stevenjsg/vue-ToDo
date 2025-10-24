<script setup lang="ts">
import { computed } from 'vue'

// Definimos las propiedades que el modal puede recibir
const props = withDefaults(
  defineProps<{
    visible: boolean // Controla si el modal se muestra (usado con v-model)
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    confirmVariant?: 'primary' | 'danger' | 'warning' // Para estilizar el botón de confirmación
  }>(),
  {
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    confirmVariant: 'primary',
  },
)

// Definimos los eventos que el modal puede emitir
const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void // Necesario para v-model:visible
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

// Clases CSS para el botón de confirmación según la variante
const confirmButtonClass = computed(() => {
  return {
    'btn-primary': props.confirmVariant === 'primary',
    'btn-danger': props.confirmVariant === 'danger',
    'btn-warning': props.confirmVariant === 'warning',
    // Puedes añadir más variantes si necesitas
  }
})

// Funciones para manejar los clics
const handleConfirm = () => {
  emit('confirm')
  emit('update:visible', false) // Cierra el modal
}

const handleCancel = () => {
  emit('cancel')
  emit('update:visible', false) // Cierra el modal
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="visible" class="modal-overlay" @click.self="handleCancel">
        <div class="modal-content">
          <h3>{{ title }}</h3>
          <p>{{ message }}</p>

          <div class="modal-custom-content">
            <slot></slot>
          </div>

          <div class="modal-actions">
            <button @click="handleCancel" class="btn-secondary">{{ cancelText }}</button>
            <button @click="handleConfirm" :class="confirmButtonClass">{{ confirmText }}</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-custom-content {
  margin-bottom: 1.5rem; /* Espacio antes de los botones */
  text-align: left; /* Opcional: alinea el contenido del slot a la izquierda */
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid var(--color-border);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 400px;
  text-align: center;
  /* Animación de entrada */
  transform: scale(1);
  transition: transform 0.2s ease-out;
}

.modal-content h3 {
  margin-top: 0;
  margin-bottom: 1rem;
}

.modal-content p {
  margin-bottom: 2rem;
  color: var(--color-text-secondary);
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

/* Estilos base para botones del modal */
.modal-actions button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition:
    background-color 0.2s,
    color 0.2s,
    border-color 0.2s;
}

/* Botón Secundario (Cancelar) */
.btn-secondary {
  background-color: var(--color-border);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}
.btn-secondary:hover {
  filter: brightness(0.9); /* Ligeramente más oscuro al pasar el ratón */
}

/* Variantes del Botón de Confirmación */
.btn-primary {
  background-color: var(--color-accent);
  color: white;
}
.btn-primary:hover {
  background-color: var(--color-accent-hover);
}

.btn-danger {
  background-color: #e53e3e;
  color: white;
}
.btn-danger:hover {
  background-color: #c53030;
}

.btn-warning {
  background-color: #f39c12;
  color: white;
}
.btn-warning:hover {
  background-color: #d38d0f;
}

/* --- Transición Fade para el Overlay y Escala para el Contenido --- */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-active .modal-content,
.modal-fade-leave-active .modal-content {
  transition: transform 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .modal-content,
.modal-fade-leave-to .modal-content {
  transform: scale(0.95);
}
</style>
