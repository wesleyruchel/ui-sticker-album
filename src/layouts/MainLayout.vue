<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-1">
    <q-header class="bg-grey-1 text-grey-8 q-py-xs">
      <q-toolbar>
        <q-toolbar-title shrink class="text-weight-bold">
          APRENDIZADO INTERATIVO
        </q-toolbar-title>
        <q-space />
        <div class="q-gutter-sm row items-center no-wrap">
          <div>
            <span>Olá,</span> <span class="text-bold">{{ firstName }}</span>
            <br /><span class="text-caption text-grey-6">{{ role }}</span>
          </div>
          <q-btn round dense flat color="grey-8" icon="notifications">
            <q-badge color="red" text-color="white" floating> 2 </q-badge>
          </q-btn>
          <q-btn round flat icon="person">
            <q-menu transition-show="flip-right" transition-hide="flip-left">
              <q-list style="min-width: 100px">
                <q-item clickable @click="goToProfile">
                  <q-item-section>Perfil</q-item-section>
                </q-item>
                <q-item clickable @click="goToSettings">
                  <q-item-section>Configurações</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Sobre</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable @click="logout">
                  <q-item-section>Sair</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>
    <q-footer reveal elevated>
      <q-toolbar>
        <q-space />
        <div class="q-gutter-sm row items-center no-wrap">
          <span class="q-subtitle-1 q-pl-md">
            2024 - TODOS OS DIREITOS RESERVADOS
          </span>
        </div>
        <q-space />
        <q-btn flat label="SOBRE" to="/about" />
      </q-toolbar>
    </q-footer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "src/stores/authStore";
import { getDynamicRoute } from "src/utils/routeHelpers";

const router = useRouter();
const authStore = useAuthStore();

const firstName = authStore.userAuth.firstName;
const role = authStore.userAuth.role;

const goToProfile = () => {
  router.push(getDynamicRoute("perfil"));
};

const goToSettings = () => {};

const logout = () => {
  authStore.logout();
  router.push("/");
};
</script>
