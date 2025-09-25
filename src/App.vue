<script setup lang="ts">
// import { ref } from 'vue'
// import type { Tarea } from './data/DataTypes'
import { RouterView, RouterLink } from 'vue-router'
// import FormToDo from './components/FormToDo.vue'
// import ListToDo from './components/ListToDo.vue'
import { useAuthStore } from '@/stores/auth'

// const KEY_LOCAL = 'tareas-vue'
// import { saveLocal, readLocal, updateLocal } from './lib/saveLocal'
const authStore = useAuthStore()
// const tareas = ref<Tarea[]>(readLocal(KEY_LOCAL))

// const handleAgregarTarea = (descripcion: string) => {
//   const nuevaTarea: Tarea = {
//     id: Date.now(),
//     descripcion: descripcion,
//     completada: false,
//     fechaCreacion: new Date(),
//     fechaModificacion: new Date(),
//     prioridad: 'media',
//     etiquetas: [],
//   }
//   console.log('Nueva tarea agregada:', nuevaTarea)
//   saveLocal(KEY_LOCAL, nuevaTarea)
//   tareas.value.push(nuevaTarea)
// }
// const handleEliminarTarea = (index: number) => {
//   tareas.value.splice(index, 1)
// }

// const handleToggleCompleted = (id: number) => {
//   const tarea = tareas.value.find((t) => t.id === id)
//   if (tarea) {
//     tarea.completada = !tarea.completada
//     tarea.fechaModificacion = new Date()
//     updateLocal(KEY_LOCAL, tareas.value)
//   }
// }
</script>

<template>
  <header>
    <nav>
      <template v-if="authStore.isAuthenticated">
        <RouterLink to="/tareas">Mis Tareas</RouterLink>
        <button @click="authStore.logout">Cerrar Sesión</button>
      </template>
      <template v-else>
        <RouterLink to="/login">Iniciar Sesión</RouterLink>
        <RouterLink to="/register">Registro</RouterLink>
      </template>
    </nav>
  </header>

  <main>
    <RouterView />
  </main>
</template>

<style scoped>
.todo-app {
  max-width: 400px;
  margin: 2rem auto;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 0 15px 5px rgba(255, 255, 255, 0.2);
}
h1 {
  text-align: center;
  margin-bottom: 1rem;
  font-weight: 800;
}
/* Añade algunos estilos para la barra de navegación */
header {
  background-color: #2c3e50;
  padding: 1rem;
  color: white;
}
nav {
  display: flex;
  gap: 1rem;
  align-items: center;
}
nav a,
nav button {
  color: white;
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}
nav a.router-link-exact-active {
  font-weight: bold;
}
</style>
