const routes = [
  {
    path: "/",
    component: () => import("pages/IndexPage.vue"),
  },
  {
    path: "/",
    component: () => import("src/layouts/AuthLayout.vue"),
    children: [
      { path: "login", component: () => import("pages/LoginPage.vue") },
      { path: "cadastro", component: () => import("pages/RegisterPage.vue") },
    ],
  },
  {
    path: "/",
    component: () => import("src/layouts/MainLayout.vue"),
    children: [
      {
        path: "perfil",
        component: () => import("pages/UserProfilePage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "edu/inicio",
        component: () => import("pages/Educator/HomePage.vue"),
        meta: { requiresAuth: true, role: "educador" },
      },
      {
        path: "edu/album/:id?",
        component: () => import("pages/Educator/AlbumPage.vue"),
        meta: { requiresAuth: true, role: "educador" },
      },
      {
        path: "edu/corrigir",
        component: () => import("pages/Educator/StickerCorrectionPage.vue"),
        meta: { requiresAuth: true, role: "educador" },
      },
      {
        path: "lea/inicio",
        component: () => import("pages/Learner/HomePage.vue"),
        meta: { requiresAuth: true, role: "aprendiz" },
      },
      {
        path: "lea/album/:id/:name?",
        component: () => import("pages/Learner/AlbumPage.vue"),
        meta: { requiresAuth: true, role: "aprendiz" },
      },
    ],
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
