<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '@/services/api'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const router = useRouter()

const handleRegister = async () => {
  try {
    errorMessage.value = ''
    await apiClient.post('/auth/register', {
      email: email.value,
      password: password.value,
    })

    // Si el registro es exitoso, informa al usuario y redirígelo al login
    successMessage.value = '¡Registro exitoso! Ahora puedes iniciar sesión.'
    setTimeout(() => {
      router.push('/login')
    }, 2000)
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
  <form @submit.prevent="handleRegister">
    <h2>Registro</h2>
    <input v-model="email" type="email" placeholder="Email" required />
    <input v-model="password" type="password" placeholder="Contraseña" required />
    <button type="submit">Crear Cuenta</button>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
  </form>
</template>
