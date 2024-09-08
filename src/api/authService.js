import { api } from "src/boot/axios";
import { formatSuccess, formatError } from "src/utils/httpUtils";
import { sqlServerDateTimeFormat } from "src/utils/common";

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

  async refreshAcessToken(acessToken, refreshToken) {
    try {
      const response = await api.post("/auth/refresh-token", {
        acessToken,
        refreshToken,
      });
      return formatSuccess(response);
    } catch (error) {
      throw formatError(error);
    }
  },
};
