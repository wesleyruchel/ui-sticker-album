<template>
  <q-page class="q-pa-lg">
    <div class="row items-center justify-between q-mt-md q-mb-md q-mx-md">
      <div class="text-h5">Meus álbums</div>
      <div>
        <q-btn
          rounded
          label="Novo"
          color="primary"
          icon="library_add"
          class="button"
          @click="prompt = true"
        />
        <q-dialog v-model="prompt" persistent>
          <q-card style="min-width: 350px">
            <q-card-section>
              <div class="text-h6 text-primary">
                Código do álbum compartilhado
              </div>
            </q-card-section>
            <q-card-section class="q-pt-none">
              <q-input
                dense
                v-model="sharedCode"
                autofocus
                @keyup.enter="prompt = false"
              />
            </q-card-section>
            <q-card-actions align="right" class="text-primary">
              <q-btn flat label="Cancelar" v-close-popup />
              <q-btn
                flat
                label="Adicionar álbum!"
                v-close-popup
                @click="getAlbum"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </div>
    <q-separator class="q-my-md q-mx-md" />
    <div class="row q-gutter-md section-card" flat bordered>
      <q-card
        v-for="album in albums"
        :key="album.id"
        class="col-12 col-md-2 rounded-card"
        flat
        bordered
        @click="goToAlbum(album.id, album.title)"
      >
        <q-img :src="album.imageUrl">
          <template v-slot:error>
            <div class="q-pa-md flex flex-center full-width full-height">
              <q-icon name="warning" size="64px" color="grey-4" />
            </div>
          </template>
          <template v-if="!album.imageUrl">
            <div class="q-pa-md flex flex-center full-width full-height">
              <q-icon name="no_photography" size="64px" color="grey-4" />
            </div>
          </template>
        </q-img>
        <q-card-section>
          <div class="text-h5 q-mt-sm q-mb-xs">{{ album.title }}</div>
          <div class="text-subtitle1 q-mb-sm">{{ album.description }}</div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { fetchAlbums, getSharedAlbum } from "src/api/userService";
import { HandlerLoading } from "src/utils/loaderUtils";
import useNotifications from "src/utils/notificationUtils";

const router = useRouter();
const { showErrorNotification } = useNotifications();

const albums = ref({});
const prompt = ref(false);
const sharedCode = ref("");

onMounted(() => {
  fetchAlbumsData();
});

const fetchAlbumsData = async () => {
  try {
    HandlerLoading.show("Aguarde... Estamos carregando seus álbuns...");
    const { items } = await fetchAlbums();
    albums.value = items;
  } catch (error) {
    showErrorNotification(error.message);
  } finally {
    HandlerLoading.hide();
  }
};

const getAlbum = async () => {
  try {
    const response = await getSharedAlbum(sharedCode.value);
    if (response) {
      router.go();
    }
  } catch (error) {
    showErrorNotification(error.message);
  }
};

const goToAlbum = async (albumId, albumTitle) => {
  router.push(`album/${albumId}/${albumTitle}`);
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
  cursor: pointer;
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
</style>
