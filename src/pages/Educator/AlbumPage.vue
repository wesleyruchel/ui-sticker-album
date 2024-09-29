<template>
  <q-page class="q-pa-md">
    <div class="row items-center justify-between q-mt-md q-mb-md q-mx-md">
      <div class="text-h5">{{ albumId ? "Editar" : "Criar" }} Álbum</div>
      <q-btn
        rounded
        color="primary"
        class="button"
        icon="home"
        label="Início"
        @click="goToHome"
      />
    </div>
    <q-separator class="q-my-md q-mx-md" />
    <form @submit.prevent.stop="handleFormAlbumAction">
      <q-card class="q-mb-md rounded-card q-mx-md flat bordered">
        <q-card-section class="q-pa-sm">
          <q-list class="row">
            <q-item class="col-12">
              <q-item-section side class="q-flex q-flex-column q-align-start">
                <q-img
                  :src="albumData.imageUrl"
                  style="width: 190px; height: 250px; object-fit: cover"
                >
                  <template v-slot:error>
                    <div
                      class="q-pa-md flex flex-center full-width full-height"
                    >
                      <q-icon name="warning" size="64px" color="grey-4" />
                    </div>
                  </template>
                  <template v-if="!albumData.imageUrl">
                    <div
                      class="q-pa-md flex flex-center full-width full-height"
                    >
                      <q-icon
                        name="add_photo_alternate"
                        size="64px"
                        color="grey-4"
                      />
                    </div>
                  </template>
                </q-img>
                <q-btn
                  rounded
                  color="primary"
                  label="Carregar capa"
                  icon="upload"
                  class="text-capitalize q-mt-sm"
                  :disable="albumId && !albumData.editable"
                  @click="uploadImage()"
                />
                <input
                  type="file"
                  ref="fileInput"
                  @change="onFileChange"
                  accept="image/*"
                  style="display: none"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  rounded
                  outlined
                  ref="albumDataTitleRef"
                  v-model="albumData.title"
                  label="Título *"
                  class="q-mb-md"
                  :disable="albumId && !albumData.editable"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0) ||
                      'É necessário informar um título para o álbum.',
                  ]"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  rounded
                  outlined
                  v-model="albumData.description"
                  label="Descrição"
                  type="textarea"
                  class="q-mb-md"
                  :disable="albumId && !albumData.editable"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            rounded
            class="button"
            color="primary"
            :label="
              albumId
                ? albumData.editable
                  ? 'Salvar'
                  : 'Editar'
                : 'Criar novo'
            "
            :icon="albumId ? (albumData.editable ? 'save' : 'edit') : 'add'"
            @click="
              handleFormAlbumAction(
                albumId ? (albumData.editable ? 'save' : 'edit') : 'add'
              )
            "
          />
          <q-btn
            v-if="albumData.editable"
            rounded
            color="negative"
            label="Cancelar"
            icon="cancel"
            @click="handleFormAlbumAction('cancel')"
          />
        </q-card-actions>
      </q-card>
    </form>
    <q-separator class="q-my-md q-mx-md" />
    <div class="q-mx-md">
      <div class="row items-center justify-between q-mt-md q-mb-md">
        <div class="text-h5">Criar figurinha</div>
      </div>
      <form @submit.prevent.stop="handleFormStickerAction">
        <q-card class="q-mb-md rounded-card">
          <q-card-section class="q-pa-sm">
            <q-list class="row">
              <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-input
                    rounded
                    outlined
                    ref="formStickerTitleRef"
                    v-model="formSticker.title"
                    label="Título *"
                    class="q-mb-sm"
                    :disable="!formSticker.editable"
                    lazy-rules
                    :rules="[
                      (val) =>
                        (val && val.length > 0) ||
                        'É necessário informar um título para a figurinha.',
                    ]"
                  />
                </q-item-section>
              </q-item>
              <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-input
                    rounded
                    outlined
                    ref="formStickerDescriptionRef"
                    v-model="formSticker.description"
                    label="Descrição *"
                    type="textarea"
                    :disable="!formSticker.editable"
                    lazy-rules
                    :rules="[
                      (val) =>
                        (val && val.length > 0) ||
                        'É necessário informar uma descrição para a figurinha.',
                    ]"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              rounded
              color="primary"
              :disable="!albumId"
              :label="formSticker.editable ? 'Salvar' : 'Criar nova'"
              :icon="formSticker.editable ? 'save' : 'add'"
              @click="handleFormStickerAction('add')"
              class="q-ml-md"
            />
            <q-btn
              v-if="formSticker.editable"
              rounded
              color="negative"
              label="Cancelar"
              icon="cancel"
              @click="handleFormStickerAction('cancel')"
              class="q-ml-md"
            />
          </q-card-actions>
        </q-card>
      </form>
      <div class="row items-center justify-between q-mt-md q-mb-md">
        <div class="text-h5">Figurinhas do álbum</div>
      </div>
      <div v-for="(card, index) in stickersAlbum" :key="index" class="q-mb-md">
        <q-card class="q-mb-md rounded-card">
          <q-card-section class="q-pa-sm">
            <q-list class="row">
              <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-input
                    rounded
                    outlined
                    v-model="card.title"
                    label="Título"
                    :disable="!card.editable"
                    :rules="[
                      (val) =>
                        (val && val.length > 0) ||
                        'É necessário informar um título para a figurinha.',
                    ]"
                  />
                </q-item-section>
              </q-item>
              <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-input
                    rounded
                    outlined
                    v-model="card.description"
                    label="Descrição"
                    type="textarea"
                    :disable="!card.editable"
                    :rules="[
                      (val) =>
                        (val && val.length > 0) ||
                        'É necessário informar uma descrição para a figurinha.',
                    ]"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              rounded
              color="primary"
              :label="card.editable ? 'Salvar' : 'Editar'"
              :icon="card.editable ? 'save' : 'edit'"
              @click="
                handleCardStickerEdit(index, card.editable ? 'save' : 'edit')
              "
              class="q-ml-md"
            />
            <q-btn
              v-if="card.editable"
              rounded
              color="negative"
              icon="cancel"
              @click="handleCardStickerEdit(index, 'cancel')"
              label="Cancelar"
              class="q-ml-md"
            />
            <q-btn
              v-if="!card.editable"
              rounded
              color="negative"
              icon="delete"
              label="Excluir"
              @click="removeSticker(index)"
              class="q-ml-md"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  createAlbum,
  updateAlbum,
  fetchAlbumById,
  fetchStickersAlbumById,
} from "src/api/albumsService";
import {
  createSticker,
  updateSticker,
  deleteSticker,
} from "src/api/stickersService";
import { getDynamicRoute } from "src/utils/routeHelpers";
import { HandlerLoading } from "src/utils/loaderUtils";
import { api } from "src/boot/axios";
import useNotifications from "src/utils/notificationUtils";

const route = useRoute();
const router = useRouter();
const { showSuccessNotification, showErrorNotification } = useNotifications();

const albumId = ref(route.params.id || null);
const albumDataTitleRef = ref(null);

const albumData = ref({
  imageUrl: null,
  imageBase64: "",
  title: "",
  description: "",
  community: false,
  shared: false,
  blocked: false,
  editable: false,
});

const formStickerTitleRef = ref(null);
const formStickerDescriptionRef = ref(null);

const formSticker = ref({
  title: "",
  description: "",
  editable: false,
});

const stickersAlbum = ref([]);
const isEditing = computed(() => !!albumId.value);

const beforeEdit = ref({
  albumTitle: "",
  albumDescription: "",
  cardStickerTitle: "",
  cardStickerDescription: "",
});

const fileInput = ref(null);

const uploadImage = async () => {
  fileInput.value.click();
};

const onFileChange = (event) => {
  try {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        albumData.value.imageUrl = e.target.result;
        albumData.value.imageBase64 = new String(e.target.result).split(",")[1];
      };
      reader.readAsDataURL(file);
    }
  } catch (error) {
    showErrorNotification(error.message);
  } finally {
  }
};

onMounted(async () => {
  if (isEditing.value) {
    HandlerLoading.show("Aguarde... Estamos carregando os dados para você...");

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
      HandlerLoading.hide();
    }
  }
});

const goToHome = () => {
  router.push(getDynamicRoute("inicio"));
};

const handleFormAlbumAction = async (action) => {
  if (action === "edit") {
    beforeEdit.value.albumTitle = albumData.value.title;
    beforeEdit.value.albumDescription = albumData.value.description;
  } else if (action === "cancel") {
    albumData.value.title = beforeEdit.value.albumTitle;
    albumData.value.description = beforeEdit.value.albumDescription;
    albumDataTitleRef.value.resetValidation();
  } else {
    albumDataTitleRef.value.validate();

    if (albumDataTitleRef.value.hasError) return;

    try {
      HandlerLoading.show("Aguarde... Estamos salvando os dados para você...");

      if (albumId.value) {
        const response = await updateAlbum(albumId.value, {
          id: albumId.value,
          imageBase64: albumData.value.imageBase64,
          title: albumData.value.title,
          description: albumData.value.description,
          community: albumData.value.community,
          shared: albumData.value.shared,
          blocked: albumData.value.shared,
        });
        if (response.data) showSuccessNotification(response.message);
      } else {
        const response = await createAlbum({
          imageBase64: albumData.value.imageBase64,
          title: albumData.value.title,
          description: albumData.value.description,
          community: albumData.value.community,
        });

        if (response.data) {
          albumId.value = response.data.id;
          router.push(`/edu/album/${albumId.value}`);
          showSuccessNotification(response.message);
        }
      }
    } catch (error) {
      showErrorNotification(error.message);
    } finally {
      HandlerLoading.hide();
    }
  }
  albumData.value.editable =
    action === "add" ? false : !albumData.value.editable;
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

const handleFormStickerAction = async (action) => {
  if (action === "cancel") {
    formSticker.value.title = "";
    formSticker.value.description = "";
    formStickerTitleRef.value.resetValidation();
    formStickerDescriptionRef.value.resetValidation();
  } else {
    if (!albumId.value) return;

    formStickerTitleRef.value.validate();
    formStickerDescriptionRef.value.validate();

    if (
      formStickerTitleRef.value.hasError ||
      formStickerDescriptionRef.value.hasError
    )
      return;

    if (formSticker.value.editable) {
      try {
        HandlerLoading.show(
          "Aguarde... Estamos salvando os dados para você..."
        );
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
        HandlerLoading.hide();
      }
    }
  }
  formSticker.value.editable = !formSticker.value.editable;
};

const handleCardStickerEdit = async (index, action) => {
  if (action === "edit") {
    beforeEdit.value.cardStickerTitle = stickersAlbum.value[index].title;
    beforeEdit.value.cardStickerDescription =
      stickersAlbum.value[index].description;
  } else if (action === "cancel") {
    stickersAlbum.value[index].title = beforeEdit.value.cardStickerTitle;
    stickersAlbum.value[index].description =
      beforeEdit.value.cardStickerDescription;
  } else {
    if (
      new String(stickersAlbum.value[index].title).length == 0 ||
      new String(stickersAlbum.value[index].description).length == 0
    ) {
      showErrorNotification(
        "Atenção! Certifique-se que os dados estão preenchidos corretamente."
      );
      return;
    }

    if (stickersAlbum.value[index].editable) {
      try {
        const response = await updateSticker(stickersAlbum.value[index].id, {
          id: stickersAlbum.value[index].id,
          title: stickersAlbum.value[index].title,
          description: stickersAlbum.value[index].description,
          albumId: albumId.value,
        });
        if (response) showSuccessNotification(response.message);
      } catch (error) {
        showErrorNotification(error.message);
      } finally {
        HandlerLoading.hide();
      }
    }
  }
  stickersAlbum.value[index].editable = !stickersAlbum.value[index].editable;
};

const removeSticker = async (index) => {
  try {
    HandlerLoading.show("Aguarde... Estamos removendo a figurinha do álbum...");
    const response = await deleteSticker(stickersAlbum.value[index].id);
    if (response) {
      stickersAlbum.value.splice(index, 1);
      showSuccessNotification(response.message);
    }
  } catch (error) {
    showErrorNotification(error.message);
  } finally {
    HandlerLoading.hide();
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

.button {
  width: 150px;
  height: 36px;
  min-width: 150px;
  max-width: 150px;
}
</style>
