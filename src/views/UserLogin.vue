<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const authStore = useAuthStore()

const handleLogin = async () => {
  try {
    console.log('Intentando iniciar sesión con:', email.value)
    console.log('Intentando iniciar sesión con:', password.value)
    await authStore.login(email.value, password.value)
  } catch (error: any) {
    errorMessage.value = 'Email o contraseña incorrectos.'
    console.error('Error de login:', error)
  }
}
</script>

<template>
  <form @submit.prevent="handleLogin">
    <h2>Iniciar Sesión</h2>
    <input v-model="email" type="email" placeholder="Email" required />
    <input v-model="password" type="password" placeholder="Contraseña" required />
    <button type="submit">Entrar</button>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </form>
</template>
