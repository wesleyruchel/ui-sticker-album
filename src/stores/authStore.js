import { defineStore } from "pinia";
import { AuthService } from "src/api/authService";
import { jwtDecode } from "jwt-decode";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    accessToken: localStorage.getItem("accessToken") || null,
    refreshToken: localStorage.getItem("refreshToken") || null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.accessToken,
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
          this.accessToken = response.data.token;
          this.refreshToken = response.data.refreshToken;
          this.user = getUserInfoByAcessToken(this.accessToken);
          localStorage.setItem("accessToken", this.accessToken);
          localStorage.setItem("refreshToken", this.refreshToken);
          localStorage.setItem("user", this.user);
        }
      } catch (error) {
        this.error = "Falha ao fazer login.";
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      try {
        this.user = null;
        this.accessToken = null;
        this.refreshToken = null;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      } catch (error) {
        console.error("Erro ao sair.", error);
        this.error = "Erro ao sair.";
      } finally {
      }
    },

    async refreshAccessToken() {
      try {
        const refreshToken = this.refreshToken;
        if (!refreshToken) throw new Error("Refresh token não encontrado.");
        const response = await AuthService.refreshAcessToken(refreshToken);
        if (response) {
          this.accessToken = response.data.token;
          localStorage.setItem("accessToken", this.accessToken);
        }
      } catch (error) {
        this.logout();
      }
    },
  },
});

function getUserInfoByAcessToken(token) {
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
    console.error("Ocorreu um erro ao decodificar o token:", error);
    return {};
  }
}
