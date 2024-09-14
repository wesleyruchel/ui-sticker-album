import { api } from "src/boot/axios";
import { formatSuccess, formatError } from "src/utils/httpUtils";

export const createSticker = async (sticker) => {
  try {
    const response = await api.post("/stickers", sticker, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return formatSuccess(response);
  } catch (error) {
    throw formatError(error);
  }
};

export const updateSticker = async (stickerId, sticker) => {
  try {
    const response = await api.put(`/stickers/${stickerId}`, sticker, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return formatSuccess(response);
  } catch (error) {
    throw formatError(error);
  }
};

export const deleteSticker = async (stickerId) => {
  try {
    const response = await api.delete(`/stickers/${stickerId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return formatSuccess(response);
  } catch (error) {
    throw formatError(error);
  }
};
