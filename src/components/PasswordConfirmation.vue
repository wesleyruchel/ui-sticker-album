<template>
  <div>
    <q-input
      v-model="password"
      label="Senha *"
      :type="isPwd ? 'password' : 'text'"
      rounded
      outlined
      class="q-mb-md"
      lazy-rules
      :rules="passwordRules"
    >
      <template v-slot:append>
        <q-icon
          :name="isPwd ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="isPwd = !isPwd"
        />
      </template>
    </q-input>
    <q-input
      v-model="confirmPassword"
      label="Confirmar senha *"
      :type="isConfirmPwd ? 'password' : 'text'"
      rounded
      outlined
      class="q-mb-md"
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

const passwordMismatch = computed(
  () => password.value !== confirmPassword.value
);

const passwordRules = [
  (val) => !!val || "É necessário informar uma senha.",
  (val) => val.length >= 6 || "A senha deve conter no minímo 6 caracteres.",
  (val) =>
    /[A-Z]/.test(val) ||
    "A senha deve conter ao menos uma letra maiuscula (A-Z).",
  (val) =>
    /[a-z]/.test(val) ||
    "A senha deve conter ao menos uma letra minuscula (a-z).",
  (val) => /\d/.test(val) || "A senha deve conter ao menos um número (0-9).",
  (val) =>
    /[\W_]/.test(val) ||
    "A senha deve conter ao menos um caracter especial (!@#$%&*()).",
];

watch(password, (newValue) => {
  emit("update:modelValue", { ...props.modelValue, password: newValue });
});

watch(confirmPassword, (newValue) => {
  emit("update:modelValue", { ...props.modelValue, confirmPassword: newValue });
});
</script>
