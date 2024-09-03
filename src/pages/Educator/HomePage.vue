<template>
  <q-page class="q-pa-lg">
    <div class="row items-center justify-between q-mt-md q-mb-md q-mx-md">
      <div class="text-h5">Meus álbums</div>
      <div>
        <q-btn
          unelevated
          rounded
          label="Corrigir"
          color="primary"
          class="q-ml-sm"
        />
        <q-btn
          unelevated
          rounded
          label="Novo"
          color="primary"
          class="q-ml-sm"
        />
      </div>
    </div>
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
          <q-toggle v-model="album.isLocked" label="Bloquear" />
          <q-btn
            icon="share"
            label="Compartilhar"
            color="primary"
            flat
            @click="shareMagazine(album.id)"
          />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { fetchAlbums } from "src/api/userService";
import useNotifications from "src/utils/notificationUtils";

const { showSuccessNotification, showErrorNotification } = useNotifications();

const albums = ref({});

const fetchAlbumsData = async () => {
  try {
    const { items } = await fetchAlbums();
    albums.value = items;
  } catch (error) {
    console.error(error);
    showErrorNotification(error.message);
  }
};

onMounted(() => {
  fetchAlbumsData();
});

const shareMagazine = (id) => {};
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
</style>
