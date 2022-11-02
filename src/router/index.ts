import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  linkActiveClass: "t-active",
  linkExactActiveClass: "t-active",
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "words",
      component: () => import("../views/WordsView.vue"),
    },
    {
      path: "/doubles",
      name: "doubles",
      component: () => import("../views/DoublesView.vue"),
    },
    {
      path: "/nsfws",
      name: "nsfws",
      component: () => import("../views/NsfwsView.vue"),
    },
    {
      path: "/binyans",
      name: "binyans",
      component: () => import("../views/BinyanView.vue"),
    },
    {
      path: "/bituyim",
      name: "bituyim",
      component: () => import("../views/BituyimView.vue"),
    },
    {
      path: "/tshokim",
      name: "tshokim",
      component: () => import("../views/TshokimView.vue"),
    },
    {
      path: "/lessons",
      name: "lessons",
      component: () => import("../views/LessonsView.vue"),
    },
    {
      path: "/shovers",
      name: "shovers",
      component: () => import("../views/ShoversView.vue"),
    },
    {
      path: "/reminder",
      name: "reminder",
      component: () => import("../views/RemindersView.vue"),
    },
  ],
});

export default router;
