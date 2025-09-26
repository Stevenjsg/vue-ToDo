<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import TheSidebar from './components/TheSidebar.vue'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()
const isSidebarCollapsed = ref(false)

const handleToggle = (collapsedState: boolean) => {
  isSidebarCollapsed.value = collapsedState
}

const handleLogout = () => {
  authStore.logout()
}
</script>

<template>
  <div class="app-layout" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
    <TheSidebar @toggle="handleToggle" @logout="handleLogout" />

    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style>
/* ... tus estilos de body ... */

.app-layout {
  display: flex;
  transition: padding-left 0.3s ease; /* Transición para el contenido */
}

/* Estilo para que el contenido principal se ajuste */
.main-content {
  flex-grow: 1;
  padding: 2rem;
  transition: margin-left 0.3s ease; /* Animación suave del margen */
}

/* Cuando el sidebar se colapsa, ajustamos el margen del contenido */
.app-layout.sidebar-collapsed .main-content {
  margin-left: 80px; /* Margen igual al ancho del sidebar colapsado */
}
</style>
