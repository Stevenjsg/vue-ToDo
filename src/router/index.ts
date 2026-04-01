import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import AppLayout from '@layouts/AppLayout.vue'
import LandingPage from '@views/LandingPage.vue'
import AuthView from '@views/AuthView.vue'
import ShowTareas from '@views/ShowTareas.vue'
import UserProfile from '@views/UserProfile.vue'
import PomodoroView from '@views/PomodoroView.vue'
import ReminderView from '@views/ReminderView.vue'

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: LandingPage,
    meta: {
      guest: true,
      title: 'BTaskora  - Organiza tu caos',
    },
  },
  {
    path: '/auth',
    name: 'Auth',
    component: AuthView,
    meta: {
      guest: true,
      title: 'Iniciar Sesión - BTaskora ',
    },
  },

  {
    path: '/app',
    component: AppLayout,
    meta: { requiresAuth: true },
    path: '/app', // Un prefijo común (opcional pero recomendado)
    component: AppLayout, // 👈 El layout principal
    meta: {
      requiresAuth: true,
      title: 'BTaskora  - Panel de Control',
    }, // 👈 Protege todas las rutas hijas
    children: [
      {
        path: 'tareas/personales',
        name: 'PersonalTasks',
        props: { projectUuid: null },
        component: ShowTareas,
        meta: { title: 'Mis Tareas - BTaskora ' },
      },
      {
        path: 'projects/:projectUuid/tasks',
        name: 'ProjectTasks',
        component: ShowTareas,
        props: (route: RouteLocationNormalized) => ({
          projectUuid: route.params.projectUuid as string,
        }),
      },
      {
        path: 'perfil',
        name: 'Perfil',
        component: UserProfile,
        meta: { title: 'Perfil - BTaskora ' },
      },
      {
        path: 'pomodoro',
        name: 'Pomodoro',
        component: PomodoroView,
        meta: { title: 'Pomodoro - BTaskora ' },
      },
      {
        path: 'recordatorios',
        name: 'recordatorios',
        component: ReminderView,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.beforeEach(async (to, _from) => {
  const authStore = useAuthStore()
  const isAuth = authStore.isAuthenticated
  const requiresAuth = to.meta.requiresAuth
  const isGuestRoute = to.meta.guest

  document.title = (to.meta.title as string) || 'DEFAULT_TITLE'

  if (requiresAuth && !isAuth) {
    return { name: 'Auth' }
  }

  if (isGuestRoute && isAuth) {
    return { name: 'PersonalTasks' }
  }

  return true
})

export default router
