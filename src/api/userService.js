import { api } from "src/boot/axios";
import { formatSuccess, formatError } from "src/utils/httpUtils";

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

function sqlServerDateTimeFormat(dateString) {
  const date = new Date(dateString);
  const isoString = date.toISOString();
  return isoString.split("T")[0] + "T00:00:00";
}
