<script setup lang="ts">
import { ref, onMounted } from 'vue'
import apiClient from '@/services/api'

// Interfaz local para los datos del perfil
interface UserProfile {
  id: number
  email: string
  nombre_completo: string | null
  avatar_url: string | null
  bio: string | null
  fecha_creacion: string
}

const profile = ref<UserProfile | null>(null)
const isLoading = ref(true)
const isEditing = ref(false) // Para mostrar/ocultar el formulario

const fetchProfile = async () => {
  try {
    isLoading.value = true
    const response = await apiClient.get('/users/me')
    profile.value = response.data
  } catch (error) {
    console.error('Error fetching profile:', error)
  } finally {
    isLoading.value = false
  }
}

const saveProfile = async () => {
  if (!profile.value) return
  try {
    const response = await apiClient.put('/users/me', {
      nombre_completo: profile.value.nombre_completo,
      bio: profile.value.bio,
    })
    profile.value = response.data // Actualiza con la respuesta del servidor
    isEditing.value = false // Oculta el formulario
  } catch (error) {
    console.error('Error saving profile:', error)
  }
}
const cancelEdit = () => {
  isEditing.value = false
  fetchProfile() // Reload original profile data
}
onMounted(fetchProfile)
</script>

<template>
  <div class="profile-container">
    <h1>Mi Perfil</h1>
    <div v-if="isLoading">Cargando perfil...</div>
    <div v-else-if="profile">
      <div v-if="!isEditing" class="profile-view">
        <img :src="profile.avatar_url || '/default-avatar.png'" alt="Avatar" class="avatar" />
        <h2>{{ profile.nombre_completo || 'Nombre no definido' }}</h2>
        <p class="email">{{ profile.email }}</p>
        <p class="bio">{{ profile.bio || 'Sin biografía.' }}</p>
        <p class="member-since">
          Miembro desde: {{ new Date(profile.fecha_creacion).toLocaleDateString() }}
        </p>
        <button @click="isEditing = true">Editar Perfil</button>
      </div>

      <form v-else @submit.prevent="saveProfile" class="profile-form">
        <label>Nombre Completo:</label>
        <input type="text" v-model="profile.nombre_completo" placeholder="Tu nombre" />

        <label>Biografía:</label>
        <textarea
          v-model="profile.bio"
          placeholder="Cuéntanos algo sobre ti..."
          rows="4"
        ></textarea>

        <div class="form-actions">
          <button type="submit">Guardar Cambios</button>
          <button type="button" @click="cancelEdit">Cancelar</button>
        </div>
      </form>
    </div>
    <div v-else>No se pudo cargar el perfil.</div>
  </div>
</template>

<style scoped>
.profile-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
}

.profile-view {
  text-align: center;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
  border: 3px solid var(--color-border);
}

.email {
  color: var(--color-text-secondary);
  margin-bottom: 1rem;
}

.bio {
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.member-since {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  margin-bottom: 2rem;
}

/* --- Formulario de Edición --- */
.profile-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.profile-form label {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.profile-form input,
.profile-form textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background-color: var(--color-background);
  color: var(--color-text-primary);
  font-size: 1rem;
  box-sizing: border-box; /* Importante para que el padding no desborde */
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

button {
  /* Estilos generales para botones en esta vista */
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}
button[type='submit'] {
  background-color: var(--color-accent);
  color: white;
}
button[type='button'] {
  background-color: var(--color-border);
  color: var(--color-text-primary);
}
</style>
