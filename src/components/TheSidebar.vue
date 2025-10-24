<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useProjectStore } from '@/stores/projects'
import IconTask from '@/assets/icon/IconTask.vue'
import IconUser from '@/assets/icon/IconUser.vue'
import IconLogout from '@/assets/icon/IconLogout.vue'
import IconLogin from '@/assets/icon/IconLogin.vue'
import IconPlus from '@/assets/icon/IconPlus.vue'
import { onMounted } from 'vue'
const { isVisible } = defineProps<{
  isVisible: boolean
}>()

const authStore = useAuthStore()
const projectStore = useProjectStore()
const router = useRouter()
const emit = defineEmits(['close', 'logout'])

const handleLogin = () => {
  emit('close') // Cierra el sidebar al ir a login
  router.push('/auth')
}
onMounted(() => {
  if (authStore.isAuthenticated) {
    projectStore.fetchProjects()
  }
})

const handleCreateProject = async () => {
  const projectName = prompt('Introduce el nombre del nuevo proyecto:')
  if (projectName) {
    try {
      await projectStore.createProject(projectName)
      // Opcional: Muestra una notificación de éxito
      emit('close') // Cierra el sidebar si está en móvil
    } catch (error) {
      console.error('Error al crear el proyecto:', error) // Muestra un error simple
    }
  }
}

// Función para establecer el proyecto activo
const selectProject = (id: number) => {
  projectStore.setCurrentProject(id)
  emit('close') // Cierra el sidebar en móvil al seleccionar
  // Opcional: Navegar a la vista de tareas de ese proyecto si usas rutas anidadas
  // router.push(`/app/proyectos/${id}/tareas`);
}
</script>

<template>
  <aside class="sidebar" :class="{ 'is-open': isVisible }">
    <div class="header">
      <div class="logo"><a href="/">MiApp</a></div>
    </div>
    <nav class="navigation">
      <ul>
        <li>
          <RouterLink to="/app/tareas" class="sidebar-item" @click="emit('close')">
            <IconTask />
            <span class="item-text">Mis Tareas</span>
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/app/pomodoro" class="sidebar-item" @click="emit('close')">
            <span>🍅</span>
            <span class="item-text">Pomodoro </span>
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/app/perfil" class="sidebar-item" @click="emit('close')">
            <IconUser />
            <span class="item-text">Mi Perfil</span>
          </RouterLink>
        </li>
      </ul>
      <div class="projects-section">
        <h3 class="section-title">
          <span class="item-text">Proyectos</span>
          <button @click="handleCreateProject" class="add-project-btn" title="Crear proyecto">
            <IconPlus />
          </button>
        </h3>
        <ul v-if="projectStore.isLoading">
          <li>Cargando...</li>
        </ul>
        <ul v-else-if="projectStore.projectList.length > 0">
          <li v-for="project in projectStore.projectList" :key="project.id">
            <button
              @click="selectProject(project.id)"
              class="sidebar-item project-item"
              :class="{ active: projectStore.currentProjectId === project.id }"
            >
              <span>#</span>
              <span class="item-text">{{ project.nombre }}</span>
            </button>
          </li>
        </ul>
        <p v-else class="no-projects item-text">No hay proyectos.</p>
      </div>
    </nav>

    <div class="footer">
      <button v-if="authStore.isAuthenticated" @click="emit('logout')" class="sidebar-item">
        <IconLogout /> <span class="item-text">Cerrar Sesión</span>
      </button>
      <button v-else @click="handleLogin" class="sidebar-item">
        <IconLogin /> <span class="item-text">Iniciar Sesión</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.projects-section {
  margin-top: 2rem;
  border-top: 1px solid var(--color-border);
  padding-top: 1rem;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  margin: 0 1rem 0.5rem 1rem; /* Alineado con el padding de los items */
  font-weight: 500;
}

.add-project-btn {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 0.25rem;
  display: flex; /* Para centrar el icono si es SVG */
}
.add-project-btn:hover {
  color: var(--color-text-primary);
}

.projects-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.project-item {
  /* Hereda estilos de .sidebar-item */
  font-weight: 400;
}

/* Estilo para el proyecto activo */
.project-item.active {
  background-color: var(--color-accent);
  color: white;
}
.project-item.active:hover {
  background-color: var(--color-accent-hover);
}

.no-projects {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  padding: 0 1rem;
}

/* Ocultar elementos en modo colapsado */
.sidebar.collapsed .section-title .item-text,
.sidebar.collapsed .no-projects {
  display: none;
}
.sidebar.collapsed .add-project-btn {
  /* Mantenemos el botón de añadir visible */
  margin: 0 auto; /* Centramos el botón de añadir */
}
.sidebar.collapsed .section-title {
  justify-content: center; /* Centramos el botón + */
}
/* ==========================================================================
   1. Estructura Principal del Sidebar (Modo Escritorio - Colapsado)
   ========================================================================== */
.sidebar {
  width: 80px; /* Ancho colapsado por defecto */
  height: 100vh;
  padding: 1rem;
  color: var(--color-text-primary);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  white-space: nowrap;
  overflow-x: hidden; /* Oculta texto al colapsar */
  position: sticky;
  top: 0;
  flex-shrink: 0;
}

/* ==========================================================================
   2. Cabecera (Logo y Botón de Toggle)
   ========================================================================== */
.header {
  display: flex;
  justify-content: center; /* Centrado por defecto */
  align-items: center;
  margin-bottom: 2rem;
}

.logo {
  display: none; /* Oculto por defecto */
  font-size: 1.5rem;
  font-weight: bold;
}

/* ==========================================================================
   4. Estilo Común para Enlaces y Botones
   ========================================================================== */
.sidebar-item {
  /* Estilo colapsado por defecto (círculos) */
  width: 48px;
  height: 48px;
  padding: 0;
  border-radius: 50%;
  justify-content: center;

  /* ... estilos comunes ... */
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 0.5rem auto; /* Centrados */
  color: var(--color-text-primary);
  background-color: transparent;
  border: none;
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

.item-text {
  display: none; /* Texto oculto por defecto */
}

/* ==========================================================================
   5. Estilos para el Estado EXPANDIDO (Hover en Escritorio)
   ========================================================================== */
/* Cuando el sidebar NO está en un dispositivo móvil Y se pasa el ratón por encima */
@media (min-width: 769px) {
  .sidebar:hover {
    width: 250px;
  }
  .sidebar:hover .logo {
    display: block;
  }
  .sidebar:hover .header {
    justify-content: space-between;
  }
  .sidebar:hover .sidebar-item {
    width: 100%;
    height: auto;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    justify-content: flex-start;
  }
  .sidebar:hover .item-text {
    display: inline;
  }
}

/* ==========================================================================
   6. Estilos para MÓVIL (Off-Canvas)
   ========================================================================== */
@media (max-width: 768px) {
  .sidebar {
    position: fixed; /* Posición fija para estar sobre el contenido */
    left: 0;
    top: 0;
    width: 250px; /* Ancho completo al abrir */
    z-index: 100;
    background-color: var(--color-surface);
    transform: translateX(-100%); /* Oculto fuera de la pantalla */
    transition: transform 0.3s ease-out;
  }

  /* Estado abierto en móvil */
  .sidebar.is-open {
    transform: translateX(0);
  }

  /* Mostramos el logo y el texto cuando está abierto en móvil */
  .sidebar .logo {
    display: block;
  }
  .sidebar .header {
    justify-content: space-between;
  }
  .sidebar .sidebar-item {
    width: 100%;
    height: auto;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    justify-content: flex-start;
  }
  .sidebar .item-text {
    display: inline;
  }
}
.navigation ul {
  list-style: none; /* <-- Esta es la línea clave que quita los puntos */
  padding: 0; /* <-- Esta quita el espacio a la izquierda */
  margin: 0;
}
</style>
