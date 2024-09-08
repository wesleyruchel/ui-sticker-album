import { defineStore } from "pinia";
import { AuthService } from "src/api/authService";
import { jwtDecode } from "jwt-decode";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: localStorage.getItem("user") || null,
    userRole: null,
    userRolePrefix: null,
    accessToken: localStorage.getItem("accessToken") || null,
    refreshToken: localStorage.getItem("refreshToken") || null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.accessToken,
    userAuth: (state) => JSON.parse(state.user),
    userAuthRole: (state) =>
      new String(JSON.parse(state.user).role).toLowerCase(),
    userAuthRolePrefix: (state) =>
      new String(JSON.parse(state.user).role).toLowerCase() == "educador"
        ? "edu"
        : "lea",
  },

  actions: {
    async register(user) {
      try {
        this.loading = true;
        this.error = null;
        const response = await AuthService.singUp(user);
        if (response) {
          return response;
        }
      } catch (error) {
        this.error = "Falha ao cadastrar o usuário.";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async login(credentials) {
      try {
        this.loading = true;
        this.error = null;
        const response = await AuthService.singIn(credentials);
        if (response) {
          this.accessToken = response.data.accessToken;
          this.refreshToken = response.data.refreshToken;
          this.user = getUserInfoByAccessToken(this.accessToken);
          localStorage.setItem("accessToken", this.accessToken);
          localStorage.setItem("refreshToken", this.refreshToken);
          localStorage.setItem("user", this.user);
          return response;
        }
      } catch (error) {
        this.error = "Falha ao fazer login.";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      try {
        this.user = null;
        this.accessToken = null;
        this.refreshToken = null;
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      } catch (error) {
        this.error = "Erro ao sair.";
        throw error;
      } finally {
      }
    },

    async refreshAccessToken() {
      try {
        if (!this.accessToken || !this.refreshAccessToken)
          throw new Error("Token não encontrado.");
        const response = await AuthService.refreshAcessToken(
          this.accessToken,
          this.refreshToken
        );
        if (response) {
          this.accessToken = response.data.accessToken;
          this.refreshToken = response.data.refreshToken;
          this.user = getUserInfoByAccessToken(this.accessToken);
          localStorage.setItem("accessToken", this.accessToken);
          localStorage.setItem("refreshToken", this.refreshToken);
          localStorage.setItem("user", this.user);
        }
      } catch (error) {
        this.logout();
      }
    },
  },
});

function getUserInfoByAccessToken(token) {
  try {
    const decodedToken = jwtDecode(token);
    const userInfo = {
      id: decodedToken.nameid,
      role: decodedToken.role,
      username: decodedToken.unique_name,
      email: decodedToken.email,
      firstName: decodedToken.given_name,
    };
    return JSON.stringify(userInfo);
  } catch (error) {
    return {};
  }
}
