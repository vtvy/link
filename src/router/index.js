import { createWebHistory, createRouter } from "vue-router";
import UserBook from "@/views/UserBook.vue";
import ItemPage from "@/views/ItemPage.vue";

const routes = [
    {
        path: "/",
        name: "home",
        component: () => import("@/views/HomePage.vue"),
    },
    {
        path: "/login",
        name: "login",
        component: () => import("@/views/LoginPage.vue"),
    },
    {
        path: "/admin",
        name: "admin",
        component: UserBook,
    },
    {
        path: "/admin/add",
        name: "user.add",
        component: () => import("@/views/UserAdd.vue"),
    },
    {
        path: "/user/:id",
        name: "user.edit",
        component: () => import("@/views/UserEdit.vue"),
        props: (route) => ({ userId: parseInt(route.params.id) }),
    },
    {
        path: "/items",
        name: "item",
        component: ItemPage,
    },
    {
        path: "/:pathMatch(.*)*",
        name: "notfound",
        component: () => import("@/views/NotFound.vue"),
    },
];
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});
export default router;
