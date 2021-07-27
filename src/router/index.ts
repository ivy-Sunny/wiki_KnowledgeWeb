import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router';
import About from '../views/about.vue';
import home from '../views/customer/home.vue';
import AdminEbook from '../views/admin/admin-ebook.vue';
import AdminDoc from '../views/admin/admin-doc.vue';
import AdminCategory from '../views/admin/admin-category.vue';
const routes: Array<RouteRecordRaw> = [
    {
        path: '/home',
        name: 'Home',
        component: home
    },
    {
        path: '/about',
        name: 'About',
        component: About,
    },
    {
        path: '/admin/category',
        name: 'AdminCategory',
        component: AdminCategory
    },
    {
        path: '/admin/doc',
        name: 'AdminDoc',
        component: AdminDoc
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
