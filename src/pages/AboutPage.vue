<template>
  <q-layout view="hHh lpR fFf">
    <q-header></q-header>
    <q-toolbar>
      <q-toolbar-title
        shrink
        class="text-weight-bold wrap-title"
        :style="{ fontFamily: 'Roboto', color: '#426b1f' }"
      >
        APRENDIZADO INTERATIVO
      </q-toolbar-title>
      <q-space />
    </q-toolbar>
    <q-page-container>
      <q-page padding class="full-height-page">
        <div class="q-pa-md row full-height-content">
          <q-card class="my-card">
            <q-card-section>
              <div class="text-h5 text-center">Sobre a ferramenta</div>
            </q-card-section>
            <q-card-section>
              <p class="text-body1">
                A AiApp ou Aprendizado Interativo é uma ferramenta de autoria
                multidisciplinar, inspirada visualmente em álbuns de figurinhas.
                Tem como pilares facilitar a criação de recursos educacionais e
                promover o aprendizado através da interatividade e do lúdico.
              </p>
              <p class="text-body1">
                Atualmente, está em fase de MVP (Produto Mínimo Viável), o que
                significa que a ferramenta possui os recursos essenciais para
                validar sua proposta de valor.
              </p>
              <p class="text-body1">
                É resultado do trabalho de conclusão do curso Sistemas de
                Informação da Universidade Feevele e foi desenvolvida pelo
                graduando Wesley K. Rüchel.
              </p>
              <p class="text-body1">
                Para dúvidas, problemas ou sugestões, entre em contato pelo
                e-mail
                <a href="mailto:wesleyruchel@gmail.com?subject=Contato AiApp"
                  >wesleyruchel@gmail.com</a
                >
              </p>
            </q-card-section>
          </q-card>
        </div>
      </q-page>
    </q-page-container>
    <q-footer reveal elevated>
      <q-toolbar>
        <q-space />
        <div class="q-gutter-sm row items-center no-wrap">
          <span class="q-subtitle-1 q-pl-md">
            2024 - TODOS OS DIREITOS RESERVADOS
          </span>
        </div>
        <q-space />
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup></script>

<style scoped>
.wrap-title {
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
}
@media (max-width: 600px) {
  .wrap-title {
    max-width: 200px;
    min-width: 200px;
  }
}

.my-card {
  width: 100%;
  height: 80vh;
}

.text-h5 {
  font-weight: bold;
}
</style>
