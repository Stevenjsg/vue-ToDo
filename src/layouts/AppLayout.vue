<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import TheSidebar from '@/components/TheSidebar.vue'
import IconMenu from '@/assets/icon/IconMenu.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const isSidebarVisible = ref(false) // Estado para el "drawer" móvil

const toggleSidebar = () => {
  isSidebarVisible.value = !isSidebarVisible.value
}

const handleLogout = () => {
  authStore.logout()
}
onMounted(() => {
  authStore.checkAuthAndConnect()
})
</script>

<template>
  <div class="app-layout">
    <TheSidebar :is-visible="isSidebarVisible" @logout="handleLogout" @close="toggleSidebar" />
    <div v-if="isSidebarVisible" class="sidebar-overlay" @click="toggleSidebar"></div>

    <main class="main-content">
      <button @click="toggleSidebar" class="mobile-toggle-btn">
        <IconMenu />
      </button>
      <RouterView />
    </main>
  </div>
</template>

<style>
.app-layout {
  display: flex;
}

.main-content {
  flex-grow: 1;
  padding: 2rem;
  overflow-y: auto;
  height: 100vh;
  /* En escritorio, dejamos espacio para el sidebar colapsado */
  margin-left: 80px;
}

/* El botón de menú solo es visible en móvil */
.mobile-toggle-btn {
  display: none; /* Oculto por defecto */
  background: none;
  border: none;
  color: var(--color-text-primary);
  cursor: pointer;
  font-size: 1.5rem;
  padding: 0;
  margin-bottom: 1rem;
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99;
}
@media (min-width: 769px) {
  .sidebar-overlay {
    display: none !important; /* Oculta el overlay en pantallas grandes */
  }
}
/* --- RESPONSIVE PARA MÓVIL --- */
@media (max-width: 768px) {
  .main-content {
    /* En móvil, el contenido ocupa el 100% */
    margin-left: 0;
    padding: 1rem;
  }

  .mobile-toggle-btn {
    display: block; /* Visible en móvil */
  }
}
</style>
