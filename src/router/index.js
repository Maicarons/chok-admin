import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { public: true },
  },
  {
    path: '/callback',
    name: 'Callback',
    component: () => import('../views/Callback.vue'),
    meta: { public: true },
  },
  {
    path: '/',
    component: MainLayout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue'),
        meta: { title: 'Dashboard', icon: 'DataAnalysis' },
      },
      {
        path: 'apps',
        name: 'AppManagement',
        component: () => import('../views/AppManagement.vue'),
        meta: { title: 'App Management', icon: 'Grid' },
      },
      {
        path: 'submit',
        name: 'SubmitApp',
        component: () => import('../views/SubmitApp.vue'),
        meta: { title: 'Submit App', icon: 'Upload' },
      },
      {
        path: 'submissions',
        name: 'SubmissionReview',
        component: () => import('../views/SubmissionReview.vue'),
        meta: { title: 'Review Submissions', icon: 'Checked', roles: ['admin', 'reviewer'] },
      },
      {
        path: 'issues',
        name: 'IssueReview',
        component: () => import('../views/IssueReview.vue'),
        meta: { title: 'Issue Review', icon: 'Warning' },
      },
      {
        path: 'collections',
        name: 'Collections',
        component: () => import('../views/Collections.vue'),
        meta: { title: 'Collections', icon: 'Collection' },
      },
      {
        path: 'users',
        name: 'UserManagement',
        component: () => import('../views/UserManagement.vue'),
        meta: { title: 'User Management', icon: 'User', roles: ['admin'] },
      },
      {
        path: 'settings',
        name: 'SystemSettings',
        component: () => import('../views/SystemSettings.vue'),
        meta: { title: 'Settings', icon: 'Setting' },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  // Public routes
  if (to.meta.public) {
    return next()
  }

  const token = localStorage.getItem('token')
  if (!token) {
    localStorage.setItem('redirect', to.fullPath)
    return next('/login')
  }

  // If we have a token but no user info yet, fetch it
  const { useAuthStore } = await import('../stores/auth')
  const authStore = useAuthStore()

  if (!authStore.user) {
    try {
      await authStore.fetchMe()
    } catch {
      authStore.logout()
      localStorage.setItem('redirect', to.fullPath)
      return next('/login')
    }
  }

  // Role-based access check
  const requiredRoles = to.meta.roles
  if (requiredRoles && requiredRoles.length > 0) {
    if (!requiredRoles.includes(authStore.userRole)) {
      return next('/dashboard')
    }
  }

  next()
})

export default router
