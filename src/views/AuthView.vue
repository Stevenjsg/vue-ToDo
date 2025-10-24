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
  router.push('/app/tareas')
}
</script>

<template>
  <div class="auth-container">
    <a href="/">Inicio</a>
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
/* ==========================================================================
   Base Styles (Mobile First)
   ========================================================================== */
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 90vh; /* Slightly adjusted for better vertical centering */
  padding: 1rem; /* Add padding for small screens */
  box-sizing: border-box; /* Include padding in height/width calculation */
}

.auth-card {
  width: 100%; /* Take full width on small screens */
  /* max-width: 400px; --- We'll add this back in the media query --- */
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* Slightly softer shadow */
  overflow: hidden;
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

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1.5rem; /* Slightly reduced padding for mobile */
}

.auth-form h2 {
  text-align: center;
  margin: 0 0 0.5rem 0; /* Add slight bottom margin */
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

.auth-form button[type='submit'] {
  /* More specific selector for the submit button */
  background-color: var(--color-accent);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 0.5rem; /* Add slight top margin */
}
.auth-form button[type='submit']:hover {
  background-color: var(--color-accent-hover);
}

.error {
  color: #e74c3c;
  text-align: center;
  font-size: 0.9rem;
}

/* --- ANIMATION --- */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ==========================================================================
   Desktop Styles (using media query)
   ========================================================================== */
@media (min-width: 480px) {
  /* Adjust breakpoint as needed (e.g., 600px) */
  .auth-card {
    max-width: 400px; /* Re-apply max-width for larger screens */
  }

  .auth-form {
    padding: 2rem; /* Restore larger padding */
  }
}
</style>
