<template>
  <q-page class="padding">
    <q-card class="q-pa-md">
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
          <PasswordConfirmation v-model="formData" />
          <div class="row justify-end">
            <q-btn label="Atualizar" type="submit" color="primary" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import PasswordConfirmation from "src/components/PasswordConfirmation.vue";
import useNotifications from "src/utils/notificationUtils";

const { showSuccessNotification, showErrorNotification } = useNotifications();

const formData = ref({
  name: "",
  email: "",
  bornDate: "",
  password: "",
  confirmPassword: "",
});

function handleSubmit() {
  showErrorNotification("Oops...");
}
</script>
