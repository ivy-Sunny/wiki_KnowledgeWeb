import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router';
import Home from '../views/home.vue';
import About from '../views/about.vue';
import AdminEbook from '../views/admin/admin-ebook.vue';
import AdminCategory from '../views/admin/admin-category.vue';
const routes: Array<RouteRecordRaw> = [
    {
        path: '/admin/category',
        name: 'AdminCategory',
        component: AdminCategory
    },
    {
        path: '/about',
        name: 'About',
        component: About,
    },
    {
        path: '/admin/ebook',
        name: 'AdminEbook',
        component: AdminEbook,
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
