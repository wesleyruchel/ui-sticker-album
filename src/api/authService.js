import { api } from "src/boot/axios";
import { formatSuccess, formatError } from "src/utils/httpUtils";
import { jwtDecode } from "jwt-decode";

export const singUp = async (userData) => {
  try {
    userData.value.bornDate =
      userData.value.bornDate === null
        ? null
        : sqlServerDateTimeFormat(userData.value.bornDate);

    const res = await api.post("/Auth/sign-up", userData.value, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return formatSuccess(res);
  } catch (error) {
    throw formatError(error);
  }
};

export const singIn = async (userData) => {
  try {
    const res = await api.post("/Auth/sign-in", userData.value, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    localStorage.setItem("acessToken", res.data.token);
    localStorage.setItem("refreshToken", res.data.refreshToken);
    localStorage.setItem("acessTokenExpiration", res.data.expiration);
    localStorage.setItem("user", getUserInfoByAcessToken(res.data.token));

    return formatSuccess(res);
  } catch (error) {
    throw formatError(error);
  }
};

export function isAuthenticated() {
  const acessToken = localStorage.getItem("acessToken");
  const tokenExpiration = localStorage.getItem("acessTokenExpiration");

  if (!acessToken || !tokenExpiration) return false;

  const isTokenExpired =
    new Date(tokenExpiration) <= new Date(new Date().toISOString());

  if (isTokenExpired) return false;

  return true;
}

export async function refreshAcessToken() {
  try {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) throw new Error("No refresh token available");

    const res = await api.post("/auth/refresh-token", { refreshToken });

    localStorage.setItem("acessToken", res.data.token);
    localStorage.setItem("refreshToken", res.data.refreshToken);
    localStorage.setItem("acessTokenExpiration", res.data.expiration);
    localStorage.setItem("user", getUserInfoByAcessToken(res.data.token));

    return true;
  } catch (error) {
    console.error("Erro ao tentar atualizar o token:", error);
    return false;
  }
}

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

function sqlServerDateTimeFormat(dateString) {
  const date = new Date(dateString);
  const isoString = date.toISOString();
  return isoString.split("T")[0] + "T00:00:00";
}
