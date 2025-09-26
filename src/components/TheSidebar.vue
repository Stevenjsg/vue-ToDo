<script setup lang="ts">
import { useRouter, RouterLink } from 'vue-router'
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import IconMenu from '@/assets/icon/IconMenu.vue'
import IconTask from '@/assets/icon/IconTask.vue'
import IconUser from '@/assets/icon/IconUser.vue'
import IconLogout from '@/assets/icon/IconLogout.vue'
import IconLogin from '@/assets/icon/IconLogin.vue'

const authStore = useAuthStore()
const router = useRouter()

const isSidebarVisible = ref(false)

const $emit = defineEmits(['toggleSidebar', 'logout'])

const handleLogin = () => {
  router.push('/login')
}

const toggleSidebar = () => {
  isSidebarVisible.value = !isSidebarVisible.value
}
</script>

<template>
  <aside class="sidebar" :class="{ collapsed: isSidebarVisible }">
    <div class="header">
      <div class="logo" v-if="!isSidebarVisible">MiApp</div>
      <button @click="toggleSidebar" class="toggle-btn">
        <IconMenu />
      </button>
    </div>
    <nav class="navigation">
      <ul>
        <li>
          <RouterLink to="/tareas" class="sidebar-item">
            <IconTask />
            <span class="item-text">Mis Tareas</span>
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/perfil" class="sidebar-item">
            <IconUser />
            <span class="item-text">Mi Perfil</span>
          </RouterLink>
        </li>
      </ul>
    </nav>

    <div class="footer">
      <button v-if="authStore.isAuthenticated" @click="$emit('logout')" class="sidebar-item">
        <IconLogout /> <span class="item-text">Cerrar Sesión</span>
      </button>
      <button v-else @click="handleLogin" class="sidebar-item">
        <IconLogin /> <span class="item-text">Iniciar Sesión</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
/* ==========================================================================
   1. Estructura Principal del Sidebar
   ========================================================================== */
.sidebar {
  width: 250px;
  height: 100vh;
  padding: 1rem;
  color: var(--color-text-primary);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
}

/* ==========================================================================
   2. Cabecera (Logo y Botón de Toggle)
   ========================================================================== */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  justify-items: center;
  margin-bottom: 2rem;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.toggle-btn {
  background: none;
  border: none;
  color: var(--color-text-primary);
  cursor: pointer;
  font-size: 1.5rem;
}

/* ==========================================================================
   3. Navegación y Footer
   ========================================================================== */
.navigation {
  flex-grow: 1; /* Ocupa el espacio disponible */
}

.navigation ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer {
  margin-top: auto; /* Empuja el footer hacia abajo */
}

/* ==========================================================================
   4. Estilo Común para Enlaces y Botones (LA CLAVE DE LA MEJORA)
   ========================================================================== */
.sidebar-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;

  color: var(--color-text-primary);
  background-color: transparent;
  border: none;
  border-radius: 8px;

  text-decoration: none;
  font-size: 1rem;
  cursor: pointer;

  transition: all 0.2s ease;
  overflow: hidden;
}

.sidebar-item:hover,
.sidebar-item.router-link-exact-active {
  background-color: var(--color-border);
}

/* ==========================================================================
   5. Estilos para el Estado COLAPSADO (Todo agrupado aquí)
   ========================================================================== */
.sidebar.collapsed {
  width: 80px;
}

.sidebar.collapsed .logo {
  display: none;
}

.sidebar.collapsed .header {
  justify-content: center;
}

/* El estilo de colapso ahora se aplica a la clase común */
.sidebar.collapsed .sidebar-item {
  width: 48px;
  height: 48px;
  padding: 0;
  border-radius: 50%;
  justify-content: center;
}

/* Ocultamos todo el texto dentro de los botones/enlaces colapsados */
.sidebar.collapsed .item-text {
  display: none;
}
</style>
