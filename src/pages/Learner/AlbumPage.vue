<template>
  <q-page class="q-pa-lg">
    <div class="row items-center justify-between q-mt-md q-mb-md q-mx-md">
      <div class="text-h5">{{ albumName }}</div>
      <div>
        <q-btn
          rounded
          color="primary"
          class="button"
          icon="home"
          label="Início"
          @click="goToHome"
        />
      </div>
    </div>
    <q-separator class="q-my-md q-mx-md" />
    <div class="row q-mt-md q-mb-md q-mx-md text-caption">
      * Ao colar uma figurinha automaticamente ela será encaminhada para a
      correção. A indicação no topo direito da figurinha indicará se ela está
      correta ou não. Não havendo indicação, a figurinha ainda não foi colada ou
      corrigida.
    </div>
    <div class="row q-gutter-md section-card" flat bordered>
      <q-card
        v-for="sticker in albumStickers"
        :key="sticker.id"
        class="col-12 col-md-2 rounded-card"
        flat
        bordered
      >
        <q-icon
          v-if="userStickersStatus[sticker.id]"
          :name="
            userStickersStatus[sticker.id] === 'Aprovada'
              ? 'check_circle'
              : 'cancel'
          "
          class="absolute-top-right q-pa-md"
          :color="
            userStickersStatus[sticker.id] === 'Aprovada' ? 'green' : 'red'
          "
          size="25px"
        />
        <q-card-section>
          <div class="text-h5 q-mt-sm q-mb-xs">{{ sticker.title }}</div>
          <div class="text-caption">
            {{ truncatedDescription(sticker.description) }}
            <span v-if="isDescriptionTruncated(sticker.description)">...</span>
            <q-btn
              v-if="isDescriptionTruncated(sticker.description)"
              flat
              dense
              color="primary"
              class="text-caption"
              label="Ver mais"
              @click="
                openFullDescriptionStikcerDialog(
                  sticker.description,
                  sticker.title
                )
              "
            />
          </div>
        </q-card-section>
        <q-card-section
          style="
            height: 380px;
            display: flex;
            align-items: center;
            justify-content: center;
          "
        >
          <q-img
            :src="userStickersImages[sticker.id]"
            :style="{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
            }"
            @click="openImage(userStickersImages[sticker.id])"
          >
            <template v-slot:error>
              <div class="q-pa-md flex flex-center full-width full-height">
                <q-icon name="warning" size="64px" color="grey-4" />
              </div>
            </template>
            <template v-if="!userStickersImages[sticker.id]">
              <div class="q-pa-md flex flex-center full-width full-height">
                <q-icon name="add_photo_alternate" size="64px" color="grey-4" />
              </div>
            </template>
          </q-img>
        </q-card-section>
        <q-card-section>
          <div class="row q-gutter-sm">
            <q-btn
              class="col"
              rounded
              color="primary"
              label="Carregar"
              icon="upload"
              @click="uploadImage(sticker.id)"
            />
            <q-btn
              class="col"
              rounded
              color="primary"
              label="Capturar"
              icon="camera_alt"
              @click="captureImage(sticker.id)"
            />
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>

  <q-dialog v-model="fullDescriptionStikcerDialog" persistent>
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ fullDescriptionAboutStickerTitle }}</div>
      </q-card-section>
      <q-card-section>
        <div>{{ fullDescriptionAboutSticker }}</div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Fechar" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <CameraModal
    :isOpen="cameraModalOpen"
    @photo-captured="handlePhotoCaptured"
    @close="handleCloseCameraModal"
  />

  <input
    type="file"
    ref="fileInput"
    @change="onFileChange"
    accept="image/*"
    style="display: none"
  />

  <q-dialog v-model="showImage">
    <q-img :src="selectedImage" :style="{ width: '100%', height: 'auto' }" />
    <q-icon
      name="close"
      size="md"
      color="white"
      class="dialog-close-icon"
      @click="showImage = false"
    />
  </q-dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { fetchStickersAlbumById } from "src/api/albumsService";
import { getPostedSticker, postSticker } from "src/api/userService";
import { getDynamicRoute } from "src/utils/routeHelpers";
import { HandlerLoading } from "src/utils/loaderUtils";
import useNotifications from "src/utils/notificationUtils";
import CameraModal from "src/components/CameraModal.vue";

const route = useRoute();
const router = useRouter();
const { showSuccessNotification, showErrorNotification } = useNotifications();

const albumId = ref(route.params.id || null);
const albumName = ref(route.params.name || "");
const albumStickers = ref({});
const handlerSticker = ref({ id: 0 });
const userStickersStatus = ref({});
const userStickersImages = ref({});
const showImage = ref(false);
const selectedImage = ref(false);

onMounted(() => {
  fetchAlbumStickersData(albumId.value);
});

const goToHome = () => {
  router.push(getDynamicRoute("inicio"));
};

const fetchAlbumStickersData = async (albumId) => {
  try {
    HandlerLoading.show("Aguarde... Carregando...");
    const { stickers } = await fetchStickersAlbumById(albumId);

    if (stickers) {
      albumStickers.value = stickers;
      const postedStickers = await getPostedSticker(albumId);

      if (postedStickers) {
        albumStickers.value.forEach((s) => {
          var data = postedStickers.data.find(
            (image) => image.stickerId === s.id
          );

          if (data) userStickersImages.value[s.id] = data.imageUrl;

          data = postedStickers.data.find(
            (status) => status.stickerId === s.id
          );

          if (data) userStickersStatus.value[s.id] = data.status;
        });
      }
    }
  } catch (error) {
    showErrorNotification(error.message);
  } finally {
    HandlerLoading.hide();
  }
};

const fullDescriptionStikcerDialog = ref(false);
const fullDescriptionAboutSticker = ref("");
const fullDescriptionAboutStickerTitle = ref("");
const maxCharsForDescriptionAboutSticker = 30;

const isDescriptionTruncated = (description) =>
  description.length > maxCharsForDescriptionAboutSticker;

const truncatedDescription = (description) =>
  isDescriptionTruncated(description)
    ? description.substring(0, maxCharsForDescriptionAboutSticker)
    : description;

const openFullDescriptionStikcerDialog = (description, title) => {
  fullDescriptionAboutSticker.value = description;
  fullDescriptionAboutStickerTitle.value = title;
  fullDescriptionStikcerDialog.value = true;
};

const fileInput = ref(null);

const uploadImage = async (stickerId) => {
  handlerSticker.value.id = stickerId;
  fileInput.value.click();
};

const onFileChange = (event) => {
  try {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageBase64 = new String(e.target.result).split(",")[1];

        try {
          if (handlerSticker.value.id > 0 && imageBase64.length > 0) {
            HandlerLoading.show(
              "Aguarde... estamos colando a figurinha para você..."
            );

            const posted = await postSticker({
              imageBase64,
              stickerId: handlerSticker.value.id,
            });

            if (posted) {
              userStickersImages.value[handlerSticker.value.id] =
                e.target.result;
              userStickersStatus.value[handlerSticker.value.id] = null;
              showSuccessNotification("Uhul! Nova figurinha adicionada!");
            }
          }
        } catch (error) {
          showErrorNotification(error.message);
        } finally {
          HandlerLoading.hide();
        }
      };
      reader.readAsDataURL(file);
    }
  } catch (error) {
    showErrorNotification(error.message);
  } finally {
  }
};

const cameraModalOpen = ref(false);
const capturedImage = ref(null);

const captureImage = async (stickerId) => {
  cameraModalOpen.value = true;
  capturedImage.value = null;
  handlerSticker.value.id = stickerId;
};

const handlePhotoCaptured = async (photo) => {
  capturedImage.value = photo;
  cameraModalOpen.value = false;

  try {
    const imageBase64 = new String(capturedImage.value).split(",")[1];

    if (handlerSticker.value.id > 0 && imageBase64.length > 0) {
      HandlerLoading.show(
        "Aguarde... estamos colando a figurinha para você..."
      );

      const posted = await postSticker({
        imageBase64,
        stickerId: handlerSticker.value.id,
      });

      if (posted) {
        userStickersImages.value[handlerSticker.value.id] = photo;
        userStickersStatus.value[handlerSticker.value.id] = null;
        showSuccessNotification("Uhul! Nova figurinha adicionada!");
        capturedImage.value = null;
      }
    }
  } catch (error) {
    showErrorNotification(error.message);
  } finally {
    HandlerLoading.hide();
  }
};

const handleCloseCameraModal = () => {
  cameraModalOpen.value = false;
};

const openImage = (url) => {
  selectedImage.value = url;
  showImage.value = true;
};
</script>

<style scoped>
.text-h5 {
  font-weight: bold;
}

.rounded-card {
  width: 100%;
  max-width: 340px;
  border-radius: 12px;
  transition: transform 0.2s;
}

.rounded-card:hover {
  transform: scale(1.02);
}

.q-mx-md {
  margin-left: 30px;
  margin-right: 30px;
}

.section-card {
  margin-left: 20px;
  margin-right: 20px;
}

.button {
  width: 150px;
  height: 36px;
  min-width: 150px;
  max-width: 150px;
}

.q-dialog__inner {
  max-width: 90vw;
  max-height: 90vh;
}

.dialog-close-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  padding: 8px;
  cursor: pointer;
}

.dialog-close-icon:hover {
  background: rgba(0, 0, 0, 0.8);
}
</style>
