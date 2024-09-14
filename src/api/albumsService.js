import { api } from "src/boot/axios";
import { formatSuccess, formatError } from "src/utils/httpUtils";

export const createAlbum = async (album) => {
  try {
    const response = await api.post("/albums", album, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return formatSuccess(response);
  } catch (error) {
    throw formatError(error);
  }
};

export const updateAlbum = async (albumId, album) => {
  try {
    const response = await api.put(`/albums/${albumId}`, album, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return formatSuccess(response);
  } catch (error) {
    throw formatError(error);
  }
};

export const fetchAlbumById = async (albumId) => {
  try {
    const response = await api.get(`/albums/${albumId}`);
    return response.data;
  } catch (error) {
    throw formatError(error);
  }
};

export const fetchStickersAlbumById = async (albumId) => {
  try {
    const response = await api.get(`/albums/${albumId}/stickers`);
    return {
      stickers: response.data.map(({ id, title, description }) => ({
        id,
        title,
        description,
      })),
    };
  } catch (error) {
    throw formatError(error);
  }
};
