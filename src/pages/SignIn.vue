<template>
  <q-page class="padding">
    <q-card class="q-pa-md">
      <q-card-section>
        <q-form @submit.prevent.stop="handleSubmit">
          <q-input
            v-model="formData.username"
            label="Nome de usuário"
            rounded
            outlined
            class="q-mb-md"
          />
          <PasswordInput v-model="formData" />
          <div class="row justify-center">
            <q-btn label="Acessar" type="submit" color="primary" />
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
import { singIn } from "src/api/authService";
import useNotifications from "src/utils/notificationUtils";

const router = useRouter();
const { showSuccessNotification, showErrorNotification } = useNotifications();

const formData = ref({
  username: "",
  password: "",
});

async function handleSubmit() {
  try {
    const res = await singIn(formData);
    showSuccessNotification(res.message);
    router.push("/profile");
  } catch (error) {
    showErrorNotification(error.message);
  }
}
</script>
