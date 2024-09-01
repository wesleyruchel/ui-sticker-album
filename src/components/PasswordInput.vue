<template>
  <div>
    <q-input
      v-model="password"
      label="Senha"
      :type="isPwd ? 'password' : 'text'"
      rounded
      outlined
      class="q-mb-md"
    >
      <template v-slot:append>
        <q-icon
          :name="isPwd ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="isPwd = !isPwd"
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
const isPwd = ref(true);

watch(password, (newValue) => {
  emit("update:modelValue", { ...props.modelValue, password: newValue });
});
</script>
