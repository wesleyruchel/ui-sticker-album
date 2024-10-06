import { api } from "src/boot/axios";
import { formatSuccess, formatError } from "src/utils/httpUtils";
import { sqlServerDateTimeFormatToDDMMYYYY } from "src/utils/common";

export const fetchProfile = async () => {
  try {
    const response = await api.get(`/me/profile`);
    if (response) {
      if (response.data.bornDate)
        response.data.bornDate = sqlServerDateTimeFormatToDDMMYYYY(
          response.data.bornDate
        );
      return formatSuccess(response);
    }
  } catch (error) {
    throw formatError(error);
  }
};

export const fetchAlbums = async () => {
  try {
    const response = await api.get("/me/albums", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return {
      items: response.data.map(
        ({ id, title, imageUrl, description, blocked }) => ({
          id,
          title,
          imageUrl,
          description,
          isLocked: blocked || false,
        })
      ),
    };
  } catch (error) {
    throw formatError(error);
  }
};

export const shareAlbum = async (albumId) => {
  try {
    const response = await api.post(`/me/albums/share/${albumId}`, null, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return formatSuccess(response);
  } catch (error) {
    throw formatError(error);
  }
};

export const getSharedAlbum = async (code) => {
  try {
    const response = await api.post(`/me/albums/shared/${code}`, null, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return formatSuccess(response);
  } catch (error) {
    throw formatError(error);
  }
};

export const getPostedSticker = async (albumId) => {
  try {
    const response = await api.get(`/me/albums/${albumId}/stickers`);
    return formatSuccess(response);
  } catch (error) {
    throw formatError(error);
  }
};

export const postSticker = async (data) => {
  try {
    const response = await api.post(`/me/albums/stickers`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return formatSuccess(response);
  } catch (error) {
    throw formatError(error);
  }
};

export const getAlbumsStickersToCorrection = async (allStickers) => {
  try {
    const response = await api.get(
      `/me/albums/shared/correction/stickers/${allStickers}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return formatSuccess(response);
  } catch (error) {
    throw formatError(error);
  }
};

export const updateStickerStatus = async (stickerId, status) => {
  try {
    const response = await api.patch(
      `/me/albums/stickers/${stickerId}`,
      [
        {
          op: "replace",
          path: "/status",
          value: `${status}`,
        },
      ],
      {
        headers: {
          "Content-Type": "application/json-patch+json",
        },
      }
    );
    return formatSuccess(response);
  } catch (error) {
    throw formatError(error);
  }
};
