<template>
  <q-page class="padding">
    <q-card class="q-pa-md">
      <q-card-section>
        <q-form @submit.prevent.stop="handleSubmit">
          <div class="row justify-center">
            <q-radio
              v-model="userData.type"
              val="Educador"
              label="Educador"
              class="q-mb-md"
            />
            <q-radio
              v-model="userData.type"
              val="Aprendiz"
              label="Aprendiz"
              class="q-mb-md"
            />
          </div>
          <q-input
            v-model="userData.firstName"
            label="Nome *"
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
            label="E-mail *"
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
          <q-input
            v-model="userData.username"
            label="Nome de usuário *"
            rounded
            outlined
            class="q-mb-md"
            lazy-rules
            :rules="usernameRules"
          />
          <PasswordConfirmation v-model="userData" />
          <div class="row justify-end">
            <q-btn label="Cancelar" to="/" rounded color="secondary" />
            <q-btn
              label="Criar conta"
              type="submit"
              rounded
              class="q-ml-sm"
              color="primary"
            />
          </div>

          <q-dialog v-model="isConfirming">
            <q-card>
              <q-card-section>
                <div class="text-h6">Confirmação de Criação de Conta</div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <p>
                  Ao criar a conta, você está ciente de que a ferramenta está em
                  fase de validação como MVP e podem ocorrer instabilidades.
                </p>
                <p>
                  Recomendamos salvar sua senha em um local seguro, pois a opção
                  de recuperação de senha ainda está em desenvolvimento.
                </p>
              </q-card-section>

              <q-card-actions align="right">
                <q-btn flat label="Cancelar" color="primary" v-close-popup />
                <q-btn
                  flat
                  label="Confirmar"
                  color="primary"
                  @click="confirmAccount"
                />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "src/stores/authStore";
import PasswordConfirmation from "src/components/PasswordConfirmation.vue";
import useNotifications from "src/utils/notificationUtils";

const router = useRouter();
const authStore = useAuthStore();
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

const isConfirming = ref(false);

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
  if (userData.value.type.trim() === "") {
    showErrorNotification("Por favor, selecione um tipo para criar o usuário.");
    return false;
  }
  return true;
}

const handleSubmit = () => {
  if (validSubmit()) isConfirming.value = true;
};

const confirmAccount = async () => {
  try {
    const response = await authStore.register(userData.value);
    showSuccessNotification(response.message);
    router.push("/login");
  } catch (error) {
    showErrorNotification(error.message);
  } finally {
    if (isConfirming.value) isConfirming.value = false;
  }
};
</script>
