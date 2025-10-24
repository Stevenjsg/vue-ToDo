<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useProjectStore } from '@/stores/projects'
import IconTask from '@/assets/icon/IconTask.vue'
import IconUser from '@/assets/icon/IconUser.vue'
import IconLogout from '@/assets/icon/IconLogout.vue'
import IconLogin from '@/assets/icon/IconLogin.vue'
import IconPlus from '@/assets/icon/IconPlus.vue'
import { onMounted, ref } from 'vue'
import ConfirmationModal from '@/components/common/ConfirmationModal.vue'

const { isVisible } = defineProps<{
  isVisible: boolean
}>()

const authStore = useAuthStore()
const projectStore = useProjectStore()

const router = useRouter()

const showLogoutConfirm = ref(false)
const showCreateProjectModal = ref(false)
const newProjectName = ref('')

const emit = defineEmits(['close', 'logout'])

const handleLogin = () => {
  emit('close') // Cierra el sidebar al ir a login
  router.push('/auth')
}
const handleLogoutConfirmed = () => {
  emit('logout') // Emite el evento original al padre (AppLayout)
  // No necesitas cerrar el modal aquí, el componente lo hace solo
}
const requestLogout = () => {
  showLogoutConfirm.value = true
}

onMounted(() => {
  if (authStore.isAuthenticated) {
    projectStore.fetchProjects()
  }
})

const requestCreateProject = () => {
  newProjectName.value = '' // Limpia el input antes de abrir
  showCreateProjectModal.value = true
}
const handleConfirmCreateProject = async () => {
  const name = newProjectName.value.trim()
  if (name) {
    try {
      await projectStore.createProject(name)
      // El modal se cierra solo porque @confirm también emite update:visible
      emit('close') // Cierra el sidebar en móvil
    } catch (error) {
      console.error('Error al crear el proyecto:', error)
      alert('Error al crear el proyecto.') // O una notificación mejor
    }
  } else {
    alert('Introduce un nombre para el proyecto.')
  }
}
// Función para establecer el proyecto activo
</script>

<template>
  <aside class="sidebar" :class="{ 'is-open': isVisible }">
    <header class="header">
      <div class="logo"><a href="/">MiApp</a></div>
    </header>
    <nav class="navigation">
      <ul>
        <li>
          <RouterLink
            :to="{ name: 'PersonalTasks' }"
            class="sidebar-item"
            :class="{ active: $route.name === 'PersonalTasks' }"
          >
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
          <button @click="requestCreateProject" class="add-project-btn" title="Crear proyecto">
            <IconPlus />
          </button>
        </h3>
        <ul v-if="projectStore.isLoading">
          <li>Cargando...</li>
        </ul>
        <ul v-else-if="projectStore.projectList.length > 0">
          <li v-for="project in projectStore.projectList" :key="project.id">
            <RouterLink
              :to="{ name: 'ProjectTasks', params: { projectId: project.id } }"
              class="sidebar-item project-item"
            >
              <span>#</span>
              <span class="item-text">{{ project.nombre }}</span>
            </RouterLink>
          </li>
        </ul>
        <p v-else class="no-projects item-text">No hay proyectos.</p>
      </div>
    </nav>

    <footer class="footer">
      <button v-if="authStore.isAuthenticated" @click="requestLogout" class="sidebar-item">
        <IconLogout /> <span class="item-text">Cerrar Sesión</span>
      </button>
      <button v-else @click="handleLogin" class="sidebar-item">
        <IconLogin /> <span class="item-text">Iniciar Sesión</span>
      </button>
    </footer>
  </aside>
  <ConfirmationModal
    v-model:visible="showLogoutConfirm"
    title="Confirmar Cierre de Sesión"
    message="¿Estás seguro de que quieres salir?"
    confirm-text="Cerrar Sesión"
    confirm-variant="danger"
    @confirm="handleLogoutConfirmed"
  />
  <ConfirmationModal
    v-model:visible="showCreateProjectModal"
    title="Crear Nuevo Proyecto"
    message="Introduce el nombre para tu nuevo proyecto:"
    confirm-text="Crear"
    @confirm="handleConfirmCreateProject"
  >
    <input
      type="text"
      v-model="newProjectName"
      placeholder="Nombre del proyecto..."
      class="modal-input"
      @keyup.enter="handleConfirmCreateProject"
    />
  </ConfirmationModal>
</template>

<style scoped>
.sidebar-item.router-link-active, /* Para rutas hijas */
.sidebar-item.router-link-exact-active {
  /* Para rutas exactas */
  background-color: var(--color-accent);
  color: white;
}
.modal-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background-color: var(--color-background);
  color: var(--color-text-primary);
  font-size: 1rem;
  box-sizing: border-box; /* Importante */
}

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
.footer {
  margin-top: auto;
  padding-top: 1rem;

  border-top: 1px solid var(--color-border);
}
.project-item {
  /* Hereda estilos de .sidebar-item */
  font-weight: 400;
}
.sidebar-item.active {
  background-color: var(--color-accent);
  color: white;
}
.sidebar-item.active:hover {
  background-color: var(--color-accent-hover);
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
