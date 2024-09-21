<template>
  <q-page class="q-pa-lg">
    <div class="row items-center justify-between q-mt-md q-mb-md q-mx-md">
      <div class="text-h5">Meus álbums</div>
      <div>
        <q-btn
          rounded
          label="Corrigir"
          color="primary"
          class="q-ml-sm q-mt-sm button"
          icon="rule"
          @click="goToCorrection()"
        />
        <q-btn
          rounded
          label="Novo"
          color="primary"
          class="q-ml-sm q-mt-sm button"
          icon="add_circle"
          @click="goToNewAlbum()"
        />
      </div>
    </div>
    <q-separator class="q-my-md q-mx-md" />
    <div class="q-mx-md">
      <q-card
        v-for="album in albums"
        :key="album.id"
        class="q-mb-md rounded-card"
        flat
        bordered
      >
        <q-card-section>
          <div class="text-h6">{{ album.title }}</div>
          <div class="text-subtitle1 q-mb-sm">{{ album.description }}</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            icon="edit"
            label="Editar"
            color="primary"
            flat
            @click="goToEditAlbum(album.id)"
          />
          <q-btn
            icon="share"
            label="Compartilhar"
            color="primary"
            flat
            @click="handleShareAlbum(album.id)"
          />
          <q-dialog v-model="icon">
            <q-card>
              <q-card-section class="row items-center q-pb-none">
                <div class="text-h6">Pronto! Compartilhe o código abaixo.</div>
                <q-space></q-space>
                <q-btn icon="close" flat round v-close-popup></q-btn>
              </q-card-section>
              <q-card-section>
                <div class="text-h6">{{ shareCode }}</div>
              </q-card-section>
            </q-card>
          </q-dialog>
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { fetchAlbums, shareAlbum } from "src/api/userService";
import { HandlerLoading } from "src/utils/loaderUtils";
import useNotifications from "src/utils/notificationUtils";

const router = useRouter();
const { showErrorNotification } = useNotifications();

const albums = ref({});
const shareCode = ref("");
const shareDialog = ref(false);
const icon = ref(false);

onMounted(() => {
  fetchAlbumsData();
});

const fetchAlbumsData = async () => {
  try {
    HandlerLoading.show("Aguarde... Estamos carregando seus álbuns...");
    const { items } = await fetchAlbums();
    albums.value = items;
  } catch (error) {
    console.error(error);
    showErrorNotification(error.message);
  } finally {
    HandlerLoading.hide();
  }
};

const goToCorrection = () => {
  router.push(`corrigir`);
};

const goToNewAlbum = () => {
  router.push(`album/`);
};

const goToEditAlbum = (albumId) => {
  router.push(`album/${albumId}`);
};

const handleShareAlbum = async (albumId) => {
  try {
    const response = await shareAlbum(albumId);
    if (response) {
      icon.value = true;
      shareCode.value = response.data.shareCode;
      shareDialog.value = true;
    }
  } catch (error) {}
};
</script>

<style scoped>
.text-h5 {
  font-weight: bold;
}

.rounded-card {
  border-radius: 12px;
}

.q-mx-md {
  margin-left: 30px;
  margin-right: 30px;
}

.button {
  width: 150px;
  height: 36px;
  min-width: 150px;
  max-width: 150px;
}
</style>
