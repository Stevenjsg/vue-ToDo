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
</style>
