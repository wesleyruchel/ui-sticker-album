<template>
  <q-dialog v-model="isModalOpen" persistent>
    <q-card class="q-pa-md" style="max-width: 90vw; max-height: 90vh">
      <q-card-section class="text-center">
        <div v-if="!photoTaken" class="video-container">
          <video ref="videoplayRef" autoplay playsinline class="video"></video>
        </div>
        <div v-else class="q-mt-md">
          <img
            :src="capturedImage"
            alt="Foto Capturada"
            class="captured-image"
          />
        </div>
      </q-card-section>

      <q-card-actions align="center" class="q-pt-none">
        <q-btn
          v-if="photoTaken"
          color="primary"
          icon="publish"
          label="Pronto"
          @click="confirmPhoto"
          class="full-width"
        />
        <q-btn
          v-if="photoTaken"
          color="primary"
          icon="replay"
          label="Tentar Novamente"
          @click="retry"
          class="full-width q-mt-sm"
        />
        <q-btn
          v-if="!photoTaken"
          color="primary"
          icon="photo_camera"
          label="Tirar Foto"
          @click="takePhoto"
          :disable="!cameraStart"
          class="full-width"
        />
        <q-btn
          v-close-popup
          icon="close"
          label="Cancelar"
          color="primary"
          @click="stopCamera"
          class="full-width q-mt-sm"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from "vue";
import useNotifications from "src/utils/notificationUtils";

const { showErrorNotification } = useNotifications();

const props = defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(["photo-captured"]);
const isModalOpen = ref(props.isOpen);
const enableCamera = ref(false);
const cameraStart = ref(false);
const imageCapture = ref(null);
const track = ref(null);
const photoTaken = ref(false);
const capturedImage = ref(null);
const videoplayRef = ref(null);

const useCamera = async () => {
  try {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
    await nextTick();

    if (videoplayRef.value) {
      cameraStart.value = true;
      videoplayRef.value.srcObject = mediaStream;
      track.value = mediaStream.getVideoTracks()[0];
      imageCapture.value = new ImageCapture(track.value);
    }
  } catch (error) {
    showErrorNotification(
      "Desculpe, ocorreu um erro ao acessar a camêra do dispositivo. Por favor, tente novamente em outro navegador."
    );
  }
};

const takePhoto = () => {
  if (imageCapture.value) {
    imageCapture.value
      .takePhoto()
      .then((blob) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          capturedImage.value = reader.result;
          photoTaken.value = true;
          stopCamera();
        };
      })
      .catch((error) => {
        showErrorNotification("Desculpe, um erro ocorreu");
      });
  }
};

const stopCamera = () => {
  if (track.value) {
    track.value.stop();
  }
};

const retry = () => {
  photoTaken.value = false;
  capturedImage.value = null;
  useCamera();
};

const confirmPhoto = () => {
  emit("photo-captured", capturedImage.value);
  isModalOpen.value = false;
};

watch(
  () => props.isOpen,
  (newVal) => {
    isModalOpen.value = newVal;
    if (newVal) {
      useCamera();
    }
  }
);

onMounted(() => {
  if (navigator.mediaDevices.getUserMedia) {
    enableCamera.value = true;
  }
});
</script>

<style scoped>
.video-container {
  width: 100%;
  height: auto;
  max-height: 60vh;
  overflow: hidden;
}

.video {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.captured-image {
  max-width: 100%;
  max-height: 60vh;
  margin: 0 auto;
  display: block;
}

.full-width {
  width: 100%;
}
</style>
