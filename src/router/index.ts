import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Importa tus layouts y vistas
import AppLayout from '../layouts/AppLayout.vue' // 👈 El nuevo layout
import LandingPage from '../views/LandingPage.vue'
import AuthView from '../views/AuthView.vue'
import ShowTareas from '../views/ShowTareas.vue'
import UserProfile from '@/views/UserProfile.vue'
import PomodoroView from '@/views/PomodoroView.vue'
// ... import UserProfile ...

const routes = [
  // --- Rutas de Ancho Completo (sin sidebar) ---
  {
    path: '/',
    name: 'Landing',
    component: LandingPage,
    meta: { guest: true },
  },
  {
    path: '/auth',
    name: 'Auth',
    component: AuthView,
    meta: { guest: true },
  },

  // --- Rutas de App (con sidebar) ---
  {
    path: '/app', // Un prefijo común (opcional pero recomendado)
    component: AppLayout, // 👈 El layout principal
    meta: { requiresAuth: true }, // 👈 Protege todas las rutas hijas
    children: [
      {
        path: 'tareas', // Se resuelve como /app/tareas
        name: 'Tareas',
        component: ShowTareas,
      },
      {
        path: 'perfil', // Se resuelve como /app/perfil
        name: 'Perfil',
        component: UserProfile,
      },
      {
        path: 'pomodoro', // Se resuelve como /app/pomodoro
        name: 'Pomodoro',
        component: PomodoroView,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Tu guardia de navegación ahora funciona perfectamente
// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.beforeEach(async (to, _from) => {
  const authStore = useAuthStore()
  const isAuth = authStore.isAuthenticated
  const requiresAuth = to.meta.requiresAuth
  const isGuestRoute = to.meta.guest

  if (requiresAuth && !isAuth) {
    return { name: 'Auth' }
  }

  if (isGuestRoute && isAuth) {
    // Redirige al dashboard principal
    return { name: 'Tareas' }
  }

  return true
})

export default router
