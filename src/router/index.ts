import {createRouter, createWebHistory, RouteRecordRaw, routerKey} from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: "/:pathMatch(.*)*",
        component: () => import("../views/Disk.vue")
    },
    {
        path: "/:pathMatch(.*)",
        component: () => import("../views/Disk.vue")
    },
    {
        name: 'disk',
        path: "/",
        component: () => import("../views/Disk.vue")
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router