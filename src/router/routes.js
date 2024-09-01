const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      { path: "/sign-up", component: () => import("pages/SignUp.vue") },
      { path: "/sign-in", component: () => import("pages/SignIn.vue") },
      {
        path: "/profile",
        component: () => import("pages/UserProfile.vue"),
        meta: { requiresAuth: true },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
