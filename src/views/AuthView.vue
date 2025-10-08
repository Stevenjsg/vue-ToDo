<script setup lang="ts">
import { ref, shallowRef, type Component } from 'vue'
import { useRouter } from 'vue-router'
import LoginForm from '@/components/LoginForm.vue'
import RegisterForm from '@/components/RegisterForm.vue'

const router = useRouter()
const activeComponentName = ref<'Login' | 'Register'>('Login')
const activeComponent = shallowRef<Component>(LoginForm)

const setView = (view: 'Login' | 'Register') => {
  activeComponentName.value = view
  activeComponent.value = view === 'Login' ? LoginForm : RegisterForm
}

const onAuthSuccess = () => {
  router.push('/tareas')
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-toggle">
        <button :class="{ active: activeComponentName === 'Login' }" @click="setView('Login')">
          Login
        </button>
        <button
          :class="{ active: activeComponentName === 'Register' }"
          @click="setView('Register')"
        >
          Registro
        </button>
      </div>

      <Transition name="fade" mode="out-in">
        <component :is="activeComponent" @success="onAuthSuccess" @change-view="setView('Login')" />
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.auth-card {
  width: 100%;
  max-width: 400px;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  overflow: hidden; /* Importante para los bordes redondeados */
}

.auth-toggle {
  display: flex;
}

.auth-toggle button {
  flex: 1;
  padding: 1rem;
  background-color: transparent;
  border: none;
  border-bottom: 2px solid var(--color-border);
  color: var(--color-text-secondary);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.auth-toggle button.active {
  color: var(--color-accent);
  border-bottom-color: var(--color-accent);
}

/* Estilos para el formulario (usado por ambos componentes) */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 2rem;
}

.auth-form h2 {
  text-align: center;
  margin: 0;
  color: var(--color-text-primary);
}

.auth-form input {
  background-color: var(--color-background);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 0.75rem;
  font-size: 1rem;
}

.auth-form button {
  background-color: var(--color-accent);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}
.auth-form button:hover {
  background-color: var(--color-accent-hover);
}

.error {
  color: #e74c3c;
  text-align: center;
  font-size: 0.9rem;
}

/* --- ANIMACIÓN DE TRANSICIÓN --- */
/* Esta animación crea un suave fundido (fade) entre los formularios */

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
