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
      path: "/nsfws",
      name: "nsfws",
      component: () => import("../views/NsfwsView.vue"),
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
      path: "/reminder",
      name: "reminder",
      component: () => import("../views/RemindersView.vue"),
    },
  ],
});

export default router;
