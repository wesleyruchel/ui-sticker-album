<template>
  <q-page class="padding">
    <q-card class="q-pa-md">
      <div class="row items-center justify-between q-mt-md q-mb-md q-mx-md">
        <q-btn rounded color="primary" label="Voltar" @click="goToBack" />
      </div>
      <q-card-section>
        <q-form @submit.prevent="handleSubmit">
          <q-input
            v-model="formData.name"
            label="Nome"
            rounded
            outlined
            class="q-mb-md"
          />
          <q-input
            v-model="formData.email"
            label="E-mail"
            rounded
            outlined
            class="q-mb-md"
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
          <div class="row justify-end q-pb-md">
            <q-btn label="Alterar dados" type="submit" color="primary" />
          </div>
        </q-form>
        <q-form @submit.prevent="handleSubmitChangePassword">
          <PasswordConfirmation v-model="formData" />
          <div class="row justify-end">
            <q-btn label="Alterar senha" type="submit" color="primary" />
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
import useNotifications from "src/utils/notificationUtils";

const router = useRouter();
const { showSuccessNotification, showErrorNotification } = useNotifications();

const formData = ref({
  name: "NÃO IMPLEMENTADO",
  email: "NAOIMPLEMENTADO@EXEMPLO.COM",
  bornDate: "",
  password: "",
  confirmPassword: "",
});

const goToBack = () => {
  router.back();
};

const handleSubmit = async () => {
  showErrorNotification("Oops...");
};

const handleSubmitChangePassword = async () => {
  showErrorNotification("Oops...");
};
</script>
