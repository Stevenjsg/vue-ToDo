<script setup lang="ts">
// Props para controlar visibilidad y título
defineProps<{
  visible: boolean
  title?: string
}>()

// Emit para cerrar (compatible con v-model:visible)
const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
}>()

const closeModal = () => {
  emit('update:visible', false)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="visible" class="modal-overlay" @mousedown.self="closeModal">
        <div class="modal-content">
          <div v-if="title" class="modal-header">
            <h3>{{ title }}</h3>
            <button @click="closeModal" class="close-button">&times;</button>
          </div>

          <div class="modal-body">
            <slot></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7); /* Más oscuro para pop */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  padding: 0; /* Quitamos padding aquí, lo maneja el header/body */
  border-radius: 12px;
  border: 1px solid var(--color-border);
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.4);
  width: 90%;
  max-width: 500px; /* Ancho típico para formularios */
  transform: scale(1);
  transition: transform 0.2s ease-out;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--color-border);
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.8rem;
  line-height: 1;
  color: var(--color-text-secondary);
  cursor: pointer;
}

.modal-body {
  padding: 1.5rem;
  /* Controla el scroll si el contenido es muy largo */
  max-height: 70vh;
  overflow-y: auto;
}

/* --- Transición Fade --- */
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
