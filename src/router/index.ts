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
    meta: { guest: true },
  },
  {
    path: '/auth',
    name: 'Auth',
    component: AuthView,
    meta: { guest: true },
  },

  {
    path: '/app',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'tareas/personales',
        name: 'PersonalTasks',
        props: { projectId: null },
        component: ShowTareas,
      },
      {
        path: 'projects/:projectId/tasks',
        name: 'ProjectTasks',
        component: ShowTareas,
        props: (route: RouteLocationNormalized) => ({
          projectId: parseInt(route.params.projectId as string, 10),
        }),
      },
      {
        path: 'perfil',
        name: 'Perfil',
        component: UserProfile,
      },
      {
        path: 'pomodoro',
        name: 'Pomodoro',
        component: PomodoroView,
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

  if (requiresAuth && !isAuth) {
    return { name: 'Auth' }
  }

  if (isGuestRoute && isAuth) {
    return { name: 'PersonalTasks' }
  }

  return true
})

export default router
