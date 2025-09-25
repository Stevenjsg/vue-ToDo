// ... tus imports
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  // ... otras rutas como la de login
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/UserLogin.vue'),
  },
  {
    path: '/tareas',
    name: 'Tareas',
    component: () => import('../views/ShowTareas.vue'),
    meta: { requiresAuth: true }, // 👈 Marca esta ruta como protegida
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/UserRegister.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// --- GUARDIA DE NAVEGACIÓN GLOBAL ---
router.beforeEach((to, from, next) => {
  // Solo podemos usar el store DENTRO de esta función
  const authStore = useAuthStore()

  const needsAuth = to.meta.requiresAuth

  // Si la ruta requiere autenticación y el usuario no está logueado...
  if (needsAuth && !authStore.isAuthenticated) {
    next({ name: 'Login' }) // ...redirigir a la página de login.
  } else {
    next() // ...de lo contrario, permitir el acceso.
  }
})

export default router
