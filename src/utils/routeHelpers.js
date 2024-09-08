import { useAuthStore } from "src/stores/authStore";

export function getDynamicRoute(baseRoute) {
  const authStore = useAuthStore();
  const commonRoutes = ["perfil"];
  return commonRoutes.includes(baseRoute)
    ? `/${baseRoute}`
    : `/${authStore.userAuthRolePrefix}/${baseRoute}`;
}
