<template>
  <div>
    <q-input
      v-model="password"
      label="Senha *"
      :type="isPwd ? 'password' : 'text'"
      rounded
      outlined
      class="q-mb-md"
      :rules="[passwordRules]"
    >
      <template v-slot:append>
        <q-icon
          :name="isPwd ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="isPwd = !isPwd"
        />
      </template>
    </q-input>
    <div class="password-criteria q-pa-sm q-mb-md">
      <div class="text-subtitle2 q-mb-sm">A senha precisa conter:</div>
      <div>
        <q-icon
          :name="validPassword.length ? 'check_circle' : 'cancel'"
          :color="validPassword.length ? 'positive' : 'negative'"
        ></q-icon>
        A senha deve conter no minímo 6 caracteres..
      </div>
      <div>
        <q-icon
          :name="validPassword.capital ? 'check_circle' : 'cancel'"
          :color="validPassword.capital ? 'positive' : 'negative'"
        ></q-icon>
        A senha deve conter ao menos uma letra maiuscula (A-Z).
      </div>
      <div>
        <q-icon
          :name="validPassword.lower ? 'check_circle' : 'cancel'"
          :color="validPassword.lower ? 'positive' : 'negative'"
        ></q-icon>
        A senha deve conter ao menos uma letra minuscula (a-z).
      </div>
      <div>
        <q-icon
          :name="validPassword.number ? 'check_circle' : 'cancel'"
          :color="validPassword.number ? 'positive' : 'negative'"
        ></q-icon>
        A senha deve conter ao menos um número (0-9).
      </div>
      <div>
        <q-icon
          :name="validPassword.symbol ? 'check_circle' : 'cancel'"
          :color="validPassword.symbol ? 'positive' : 'negative'"
        ></q-icon>
        A senha deve conter ao menos um caracter especial: !@#$%^&*()-_+=
      </div>
    </div>
    <q-input
      v-model="confirmPassword"
      label="Confirmar senha *"
      :type="isConfirmPwd ? 'password' : 'text'"
      rounded
      outlined
      class="q-mb-md"
      :disable="!isPasswordValid"
      :error="passwordMismatch"
      error-message="As senhas não conferem"
    >
      <template v-slot:append>
        <q-icon
          :name="isConfirmPwd ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="isConfirmPwd = !isConfirmPwd"
        />
      </template>
    </q-input>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  modelValue: Object,
});

const emit = defineEmits(["update:modelValue"]);
const password = ref(props.modelValue.password);
const confirmPassword = ref(props.modelValue.confirmPassword);
const isPwd = ref(true);
const isConfirmPwd = ref(true);
const validPassword = ref({
  length: false,
  capital: false,
  lower: false,
  number: false,
  symbol: false,
});

const passwordRules = (val) =>
  validatePassword(val) || "Todos os critérios precisam ser atendidos";

const validatePassword = (password) => {
  validPassword.value.length = password.length >= 6;
  validPassword.value.capital = /^(?=.*[A-Z])/.test(password);
  validPassword.value.lower = /^(?=.*[a-z])/.test(password);
  validPassword.value.number = /^(?=.*[0-9])/.test(password);
  validPassword.value.symbol = /^(?=.*[!@#\$%\^&\*_\-=+])/.test(password);
  return (
    validPassword.value.length &&
    validPassword.value.capital &&
    validPassword.value.lower &&
    validPassword.value.number &&
    validPassword.value.symbol
  );
};

const isPasswordValid = computed(() => validatePassword(password.value));

const passwordMismatch = computed(
  () => isPasswordValid.value && password.value !== confirmPassword.value
);

watch(password, (newValue) => {
  emit("update:modelValue", { ...props.modelValue, password: newValue });
});

watch(confirmPassword, (newValue) => {
  emit("update:modelValue", { ...props.modelValue, confirmPassword: newValue });
});
</script>
<style lang="scss">
.password-criteria {
  background-color: #efefef;
  border-radius: 0.5rem;
}
</style>
