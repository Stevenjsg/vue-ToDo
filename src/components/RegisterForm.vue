<script setup lang="ts">
import { ref } from 'vue'
import apiClient from '@/services/api'

const emit = defineEmits(['change-view'])

const email = ref('')
const password = ref('')
const successMessage = ref('')
const errorMessage = ref('')

const handleRegister = async () => {
  try {
    errorMessage.value = ''
    await apiClient.post('/auth/register', {
      email: email.value,
      password: password.value,
    })

    // Si el registro es exitoso, informa al usuario y redirígelo al login
    successMessage.value = '¡Registro exitoso! Ahora puedes iniciar sesión.'
    emit('change-view')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response && error.response.status === 409) {
      errorMessage.value = 'El email ya está en uso.'
    } else {
      errorMessage.value = 'Ocurrió un error durante el registro.'
    }
    console.error('Error de registro:', error)
  }
}
</script>
<template>
  <form @submit.prevent="handleRegister" class="auth-form">
    <h2>Crear Cuenta</h2>
    <input v-model="email" type="email" placeholder="Email" required />
    <input v-model="password" type="password" placeholder="Contraseña" required />
    <button type="submit">Registrarse</button>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </form>
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
