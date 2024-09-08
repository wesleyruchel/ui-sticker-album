<template>
  <q-layout view="hHh lpR fFf">
    <q-header> </q-header>
    <q-page-container>
      <q-page padding>
        <div class="q-pa-md row">
          <div class="col-8 flex flex-center">
            <div class="text-center">
              <h2>Aprendizado Interativo</h2>
              <h5>
                Aprendizado Interativo é uma ferramenta de autoria que permite
                criar conteúdos de aprendizado inspirados visualmente em álbuns
                de figurinha.
              </h5>
            </div>
          </div>
          <div class="col-4 flex flex-center">
            <div class="column justify-center items-center">
              <q-btn
                rounded
                class="q-mb-md fixed-button"
                label="ENTRE"
                color="primary"
                to="/login"
              />
              <q-btn
                rounded
                class="q-mb-md fixed-button"
                label="CADASTRA-SE"
                color="primary"
                to="/cadastro"
              />
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>
    <q-footer> </q-footer>
  </q-layout>
</template>

<script setup></script>

<style scoped>
.q-pa-md {
  padding: 1.5rem;
}

.text-center {
  text-align: center;
}

.column {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80vh;
}

.fixed-button {
  width: 150px;
  height: 50px;
}
</style>
