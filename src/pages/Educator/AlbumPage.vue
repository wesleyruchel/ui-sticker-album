<template>
  <q-page class="q-pa-md">
    <div class="row items-center justify-between q-mt-md q-mb-md q-mx-md">
      <div class="text-h3">{{ albumId ? "Editar" : "Criar" }} Álbum</div>
      <q-btn rounded color="primary" label="Início" @click="goToHome" />
    </div>
    <q-separator class="q-my-md q-mx-md" />
    <div class="row q-gutter-md q-pa-md items-start">
      <div class="col-12 col-md-2 image-container">
        <q-uploader
          v-if="!albumData.imageUrl"
          label="Adicionar Capa"
          color="primary"
          accept="image/*"
          :factory="customUpload"
          @added="onImageAdd"
          :multiple="false"
          class="full-width"
          hide-upload-btn
        />
        <div v-if="albumData.imageUrl" class="relative-position">
          <q-img
            :src="albumData.imageUrl"
            style="width: 300px; height: 300px"
          />
          <q-btn
            label="Alterar Imagem"
            color="primary"
            @click="changeImage"
            class="absolute-bottom-right"
            flat
          />
        </div>
      </div>
      <div class="col-12 col-md-9">
        <q-input
          rounded
          outlined
          v-model="albumData.title"
          label="Título *"
          class="q-mb-md"
          :rules="[
            (val) =>
              (val && val.length > 0) ||
              'É necessário informar um título para o álbum.',
          ]"
        />
        <q-input
          rounded
          outlined
          v-model="albumData.description"
          label="Descrição"
          type="textarea"
        />
      </div>
    </div>
    <div class="row justify-end q-pa-md q-mx-md">
      <q-btn
        rounded
        color="primary"
        :label="albumId ? 'Salvar' : 'Criar'"
        @click="handleSubmit"
      />
    </div>
    <div class="q-mx-md">
      <q-card class="q-mb-md rounded-card">
        <q-card-section class="row items-center justify-between">
          <div class="col-10">
            <q-input
              rounded
              outlined
              v-model="formSticker.title"
              label="Título *"
              class="q-mb-sm"
              :disable="!formSticker.editable"
              :rules="[
                (val) =>
                  (val && val.length > 0) ||
                  'É necessário informar um título para a figurinha.',
              ]"
            />
            <q-input
              rounded
              outlined
              v-model="formSticker.description"
              label="Descrição *"
              type="textarea"
              :disable="!formSticker.editable"
              :rules="[
                (val) =>
                  (val && val.length > 0) ||
                  'É necessário informar uma descrição para a figurinha.',
              ]"
            />
          </div>
          <q-btn
            rounded
            color="primary"
            :label="formSticker.editable ? 'Salvar' : 'Incluir'"
            @click="handleFormStickerAction"
            class="q-ml-md"
          />
        </q-card-section>
      </q-card>
      <div v-for="(card, index) in stickersAlbum" :key="index" class="q-mb-md">
        <q-card class="q-mb-md rounded-card">
          <q-card-section class="row items-center justify-between">
            <div class="col-10">
              <q-input
                rounded
                outlined
                v-model="card.title"
                label="Título"
                readonly
                :disable="!card.editable"
              />
              <q-input
                rounded
                outlined
                v-model="card.description"
                label="Descrição"
                type="textarea"
                readonly
                :disable="!card.editable"
              />
            </div>
            <div class="col-2 row items-center">
              <q-btn
                color="primary"
                icon="edit"
                @click="toggleCardEdit(index)"
                label="Editar/Salvar"
                class="q-ml-md"
              />
              <q-btn
                color="negative"
                icon="delete"
                @click="removeSticker(index)"
                label="Excluir"
                class="q-ml-md"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Loading, QSpinnerHourglass } from "quasar";
import {
  createAlbum,
  updateAlbum,
  fetchAlbumById,
  fetchStickersAlbumById,
} from "src/api/albumsService";
import { createSticker, deleteSticker } from "src/api/stickersService";
import useNotifications from "src/utils/notificationUtils";
import { getDynamicRoute } from "src/utils/routeHelpers";
import { api } from "src/boot/axios";

const route = useRoute();
const router = useRouter();
const { showSuccessNotification, showErrorNotification } = useNotifications();

const albumId = ref(route.params.id || null);
const albumData = ref({
  imageUrl: "",
  imageBase64: "",
  title: "",
  description: "",
  community: false,
  shared: false,
  blocked: false,
});

const formSticker = ref({
  title: "",
  description: "",
  editable: false,
});
const stickersAlbum = ref([]);
const isEditing = computed(() => !!albumId.value);

const changeImage = () => {
  albumData.value.imageUrl = ""; // Limpa a imagem atual para mostrar o uploader novamente
};

onMounted(async () => {
  if (isEditing.value) {
    Loading.show({ spinner: QSpinnerHourglass, message: "Carregando..." });

    try {
      const album = await fetchAlbumById(albumId.value);

      if (album) {
        albumData.value.imageUrl = album.imageUrl;
        albumData.value.title = album.title;
        albumData.value.description = album.description;
        albumData.value.community = album.community;
        albumData.value.shared = album.shared;
        albumData.value.blocked = album.blocked;
      }

      const { stickers } = await fetchStickersAlbumById(albumId.value);

      for (let index = 0; index < stickers.length; index++) {
        const element = stickers[index];
        element.editable = false;
        stickersAlbum.value.push(element);
      }
    } catch (error) {
      showErrorNotification(error.message);
    } finally {
      Loading.hide();
    }
  }
});

const goToHome = () => {
  router.push(getDynamicRoute("inicio"));
};

const handleSubmit = async () => {
  try {
    Loading.show({ spinner: QSpinnerHourglass, message: "Salvando..." });

    if (albumId.value) {
      const response = await updateAlbum(albumId.value, albumData);
      if (response.data) {
      }
    } else {
      const response = await createAlbum(albumData);

      if (response.data) {
        albumId.value = response.data.id;
        router.push(`/edu/album/${albumId.value}`);
        showSuccessNotification(response.message);
      } else {
        showErrorNotification("error");
      }
    }
  } catch (error) {
    showErrorNotification(error.message);
  } finally {
    Loading.hide();
  }
};

const onImageAdd = (files) => {
  const file = files[0];

  if (file) {
    const formData = new FormData();
    formData.append("file", file);

    api
      .post("image/convert-file-to-base64", formData)
      .then((response) => {
        albumData.value.imageBase64 = response.data.base64Content;
      })
      .catch((error) => {
        showErrorNotification(
          `Desculpe, ocorreu um erro ao adicionar a imamgem ${error.message}`
        );
      });
  }
};

const customUpload = (files) => {
  return new Promise((resolve, reject) => {
    onAdded(files);
    resolve();
  });
};

const handleFormStickerAction = async () => {
  if (!albumId.value) return;

  if (formSticker.value.editable) {
    Loading.show({ spinner: QSpinnerHourglass, message: "Salvando..." });

    try {
      const response = await createSticker({
        title: formSticker.value.title,
        description: formSticker.value.description,
        albumId: albumId.value,
      });

      if (response) {
        stickersAlbum.value.push({
          id: response.data.id,
          title: response.data.title,
          description: response.data.description,
          editable: false,
        });
        formSticker.value.title = "";
        formSticker.value.description = "";
        showSuccessNotification(response.message);
      }
    } catch (error) {
      showErrorNotification(error.message);
    } finally {
      Loading.hide();
    }
  }
  formSticker.value.editable = !formSticker.value.editable;
};

const toggleCardEdit = (index) => {
  stickersAlbum.value[index].editable = !stickers.value[index].editable;
};

const removeSticker = async (index) => {
  try {
    Loading.show({
      spinner: QSpinnerHourglass,
      message: "Removendo figurinha...",
    });
    const response = await deleteSticker(stickersAlbum.value[index].id);
    if (response) {
      stickersAlbum.value.splice(index, 1);
      showSuccessNotification(response.message);
    }
  } catch (error) {
    showErrorNotification(error.message);
  } finally {
    Loading.hide();
  }
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

.image-container {
  width: 300px;
  height: 300px;
  position: relative;
}

.relative-position {
  position: relative;
}

.absolute-bottom-right {
  position: absolute;
  bottom: 10px;
  right: 10px;
}
</style>
