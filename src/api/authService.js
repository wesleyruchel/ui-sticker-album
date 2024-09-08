import { api } from "src/boot/axios";
import { formatSuccess, formatError } from "src/utils/httpUtils";

export const AuthService = {
  async singUp(user) {
    try {
      user.bornDate =
        user.bornDate === null ? null : sqlServerDateTimeFormat(user.bornDate);

      const response = await api.post("/auth/sign-up", user, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return formatSuccess(response);
    } catch (error) {
      throw formatError(error);
    }
  },

  async singIn(credentials) {
    try {
      const response = await api.post("/auth/sign-in", credentials, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return formatSuccess(response);
    } catch (error) {
      throw formatError(error);
    }
  },

  async refreshAcessToken(refreshToken) {
    try {
      const response = await api.post("/auth/refresh-token", { refreshToken });
      return formatSuccess(response);
    } catch (error) {
      console.error("Erro ao tentar atualizar o token:", error);
      return false;
    }
  },
};

function sqlServerDateTimeFormat(dateString) {
  const date = new Date(dateString);
  const isoString = date.toISOString();
  return isoString.split("T")[0] + "T00:00:00";
}
