<template>
  <q-page class="padding">
    <q-card class="q-pa-md">
      <q-card-section>
        <q-form @submit.prevent.stop="handleSubmit">
          <q-input
            v-model="credentials.username"
            label="Nome de usuário"
            rounded
            outlined
            class="q-mb-md"
          />
          <PasswordInput v-model="credentials" />
          <div class="row justify-center">
            <q-btn
              label="Acessar"
              type="submit"
              color="primary"
              :loading="authStore.loading"
            />
          </div>
          <div class="row justify-center">
            <router-link to="/forgot-password" class="text-primary q-mt-md"
              >Esqueceu a senha?</router-link
            >
          </div>
          <div class="row justify-center">
            <router-link to="/sign-up" class="text-primary q-mt-md"
              >Cadastre-se</router-link
            >
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import PasswordInput from "src/components/PasswordInput.vue";
import useNotifications from "src/utils/notificationUtils";
import { useAuthStore } from "src/stores/authStore";

const router = useRouter();
const authStore = useAuthStore();
const { showSuccessNotification, showErrorNotification } = useNotifications();

const credentials = ref({
  username: "",
  password: "",
});

const handleSubmit = async () => {
  try {
    const response = await authStore.login(credentials.value);
    if (response) {
      showSuccessNotification(response.message);
      router.push("/inicio");
    }
  } catch (error) {
    showErrorNotification(error.message);
  }
};
</script>
