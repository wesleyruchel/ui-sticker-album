<template>
  <q-page class="padding">
    <q-card class="q-pa-md">
      <q-card-section>
        <q-form @submit.prevent.stop="handleSubmit">
          <div class="row justify-center">
            <q-radio
              v-model="formData.type"
              val="Educador"
              label="Educador"
              class="q-mb-md"
            />
            <q-radio
              v-model="formData.type"
              val="Aprendiz"
              label="Aprendiz"
              class="q-mb-md"
            />
          </div>
          <q-input
            v-model="formData.firstName"
            label="Nome *"
            rounded
            outlined
            class="q-mb-md"
            lazy-rules
            :rules="nameRules"
          />
          <q-input
            v-model="formData.lastName"
            label="Sobrenome"
            rounded
            outlined
            class="q-mb-md"
          />
          <q-input
            v-model="formData.email"
            label="E-mail *"
            rounded
            outlined
            class="q-mb-md"
            lazy-rules
            :rules="emailRules"
          />
          <q-input
            v-model="formData.bornDate"
            label="Data nascimento"
            rounded
            outlined
            class="q-mb-md"
            mask="##/##/####"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy>
                  <q-date v-model="formData.bornDate" mask="DD/MM/YYYY" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input
            v-model="formData.username"
            label="Nome de usuário *"
            rounded
            outlined
            class="q-mb-md"
            lazy-rules
            :rules="usernameRules"
          />
          <PasswordConfirmation v-model="formData" />
          <div class="row justify-end">
            <q-btn label="Criar conta" type="submit" color="primary" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import PasswordConfirmation from "src/components/PasswordConfirmation.vue";
import { singUp } from "src/api/authService";
import useNotifications from "src/utils/notificationUtils";

const router = useRouter();
const { showSuccessNotification, showErrorNotification } = useNotifications();

const formData = ref({
  type: "",
  firstName: "",
  lastName: "",
  email: "",
  bornDate: null,
  username: "",
  password: "",
  confirmPassword: "",
});

const nameRules = [
  (val) => (val && val.length > 0) || "É necessário informar um nome.",
];

const emailRules = [
  (val) => (val && val.length > 0) || "É necessário informar um e-mail.",
  (val) =>
    /^\S+@\S+\.\S+$/.test(val) || "É necessário informar um e-mail válido.",
];

const usernameRules = [
  (val) =>
    (val && val.length > 0) || "É necessário informar um nome de usuário.",
];

function validSubmit() {
  if (formData.value.type.trim() === "") {
    showErrorNotification("Por favor, selecione um tipo para criar o usuário.");
    return false;
  }
  return true;
}

async function handleSubmit() {
  try {
    if (validSubmit()) {
      const res = await singUp(formData);
      showSuccessNotification(res.message);
      router.push("/sign-in");
    }
  } catch (error) {
    console.error(error);
    showErrorNotification(error.message);
  }
}
</script>
