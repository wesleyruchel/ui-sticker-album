<template>
  <q-layout view="lHh lpR fFf">
    <q-page-container
      class="row justify-center items-center q-gutter-md"
      style="min-height: 100vh"
    >
      <div class="auth-container q-pa-md">
        <router-view />
      </div>
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.auth-container {
  max-width: 600px;
  width: 100%;
  padding: 24px;
  background: white;
}
</style>
