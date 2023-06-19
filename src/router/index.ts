import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Subjects from '@/views/Subjects.vue'
import { useAuthStore } from '@/stores/auth'


const routes: RouteRecordRaw[] = [
    { path: '/', name: 'Home', component: Home, meta: { requiresAuth: true } },
    { path: '/Subjects', name: 'Subjects', component: Subjects, meta: { requiresAuth: true } },
    { path: '/Login', name: 'Login', component: Login, meta: { guestOnly: true } }
]



const router = createRouter({
    history: createWebHistory(),
    routes
})


router.beforeEach((to, _, next) => {
    const authStore = useAuthStore();
    

    if (authStore.isLoggedIn) {
        if (to.matched.some(record => record.meta.guestOnly)){
            return next({ name: 'Home' })
        }
    }

    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!authStore.isLoggedIn)
            return next({ name: 'Login' })

    }

    return next()
})




export default router
