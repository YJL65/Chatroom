import {createRouter, createWebHistory} from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
          path: '/',
          redirect: '/login'
        },
        {
          path: '/login',
          name: 'Login',
          component: () => import('../components/Login.vue')
        },
        {
          path: '/register',
          name: 'Register',
          component: () => import('../components/Register.vue')
        },
        {
          path: '/change-password',
          name: 'ChangePassword',
          component: () => import('../components/ChangePassword.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: '/chat',
          name: 'ChatRoom',
          component: () => import('../views/ChatRoom.vue'),
          meta: { requiresAuth: true }
        }
    ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userInfo = localStorage.getItem('userInfo')
  
  if (to.meta.requiresAuth && !userInfo) {
    next('/login')
  } else {
    next()
  }
})

export default router