<template>
  <q-page class="q-pa-lg">
    <div class="row items-center justify-between q-mt-md q-mb-md q-mx-md">
      <div class="text-h5">Correções</div>
      <div>
        <q-btn rounded color="primary" label="Início" @click="goToHome" />
      </div>
    </div>
    <q-separator class="q-my-md q-mx-md" />
    <div class="row q-gutter-md section-card" flat bordered>
      <q-card
        v-for="(sticker, index) in stickers"
        :key="index"
        class="col-12 col-md-2 rounded-card"
        flat
        bordered
      >
        <q-card-section>
          <div class="text-h5 q-mt-sm q-mb-xs">{{ sticker.albumTitle }}</div>
          <div class="text-h6 q-mt-sm q-mb-xs">{{ sticker.stickerTitle }}</div>
          <div class="text-caption">
            {{ truncatedDescription(sticker.stickerDescription) }}
            <span v-if="isDescriptionTruncated(sticker.stickerDescription)"
              >...</span
            >
            <q-btn
              v-if="isDescriptionTruncated(sticker.stickerDescription)"
              flat
              dense
              color="primary"
              class="text-caption"
              label="Ver mais"
              @click="
                openFullDescriptionStikcerDialog(
                  sticker.stickerDescription,
                  sticker.stickerTitle
                )
              "
            />
          </div>
        </q-card-section>
        <q-card-section>
          <q-img :src="sticker.imageUrl">
            <template v-slot:error>
              <div class="q-pa-md flex flex-center full-width full-height">
                <q-icon name="camera" color="grey-4" />
              </div>
            </template>
          </q-img>
        </q-card-section>
        <q-list>
          <q-item>
            <q-item-section avatar>
              <q-icon color="grey" name="person" />
            </q-item-section>
            <q-item-section>
              <q-item-label style="font-weight: bold">{{
                sticker.userFirstName
              }}</q-item-label>
              <q-item-label caption>({{ sticker.userName }})</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section avatar>
              <q-icon color="grey" name="rule" />
            </q-item-section>
            <q-item-section>
              <q-item-label style="font-weight: bold">{{
                sticker.status
              }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <q-card-section>
          <div class="row q-gutter-sm">
            <q-btn
              class="col"
              rounded
              color="primary"
              label="Aprovar"
              icon="check"
              :disable="sticker.status === 'Aprovada'"
              @click="aproveSticker(sticker.userStickerId, index)"
            />
            <q-btn
              class="col"
              rounded
              color="negative"
              label="Reprovar"
              icon="close"
              :disable="sticker.status === 'Reprovada'"
              @click="reproveSticker(sticker.userStickerId, index)"
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
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  getAlbumsStickersToCorrection,
  updateStickerStatus,
} from "src/api/userService";
import { getDynamicRoute } from "src/utils/routeHelpers";
import { HandlerLoading } from "src/utils/loaderUtils";
import useNotifications from "src/utils/notificationUtils";

const router = useRouter();
const { showSuccessNotification, showErrorNotification } = useNotifications();

const stickers = ref({});

onMounted(() => {
  fetchAlbumsStickersToCorrectionData();
});

const goToHome = () => {
  router.push(getDynamicRoute("inicio"));
};

const fetchAlbumsStickersToCorrectionData = async () => {
  try {
    HandlerLoading.show("Aguarde... Carregando...");
    const response = await getAlbumsStickersToCorrection();

    if (response) {
      stickers.value = response.data;
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

const aproveSticker = async (stickerId, index) => {
  const newStatus = "Aprovada";
  const response = await updateStickerStatus(stickerId, newStatus);
  if (response) {
    showSuccessNotification("Você aprovou a figurinha!");
    stickers.value[index].status = newStatus;
  }
};

const reproveSticker = async (stickerId, index) => {
  const newStatus = "Reprovada";
  const response = await updateStickerStatus(stickerId, newStatus);
  if (response) {
    showSuccessNotification("Você reprovou a figurinha!");
    stickers.value[index].status = newStatus;
  }
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
</style>
