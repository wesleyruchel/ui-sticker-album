<template>
  <q-page class="padding">
    <q-card class="q-pa-md">
      <div class="row items-center justify-between q-mt-md q-mb-md q-mx-md">
        <q-btn
          rounded
          color="primary"
          icon="arrow_back"
          label="Voltar"
          @click="goToBack"
        />
      </div>
      <q-card-section>
        <q-form @submit.prevent="handleSubmit">
          <q-input
            v-model="userData.firstName"
            label="Nome"
            rounded
            outlined
            class="q-mb-md"
            lazy-rules
            :rules="nameRules"
          />
          <q-input
            v-model="userData.lastName"
            label="Sobrenome"
            rounded
            outlined
            class="q-mb-md"
          />
          <q-input
            v-model="userData.email"
            label="E-mail"
            rounded
            outlined
            class="q-mb-md"
            lazy-rules
            :rules="emailRules"
          />
          <q-input
            v-model="userData.bornDate"
            label="Data nascimento"
            rounded
            outlined
            class="q-mb-md"
            mask="##/##/####"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy>
                  <q-date v-model="userData.bornDate" mask="DD/MM/YYYY" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <div class="row justify-end q-pb-md">
            <q-btn
              label="Alterar dados"
              type="submit"
              rounded
              color="primary"
            />
          </div>
        </q-form>
        <q-form @submit.prevent="handleSubmitChangePassword">
          <q-input
            v-model="userData.username"
            label="Nome de usuário"
            rounded
            outlined
            class="q-mb-md"
            :disable="true"
          />
          <PasswordConfirmation v-model="userData" />
          <div class="row justify-end">
            <q-btn
              label="Alterar senha"
              type="submit"
              rounded
              color="primary"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { fetchProfile } from "src/api/userService";
import PasswordConfirmation from "src/components/PasswordConfirmation.vue";
import useNotifications from "src/utils/notificationUtils";

const router = useRouter();
const { showSuccessNotification, showErrorNotification } = useNotifications();

const userData = ref({
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

onMounted(async () => {
  fetchUserData();
});

const goToBack = () => {
  router.back();
};

const fetchUserData = async () => {
  const response = await fetchProfile();
  userData.value = response.data;
};

const handleSubmit = async () => {
  showErrorNotification(
    "Desculpe, ainda não implementamos essa funcionalidade :("
  );
};

const handleSubmitChangePassword = async () => {
  showErrorNotification(
    "Desculpe, ainda não implementamos essa funcionalidade :("
  );
};
</script>
