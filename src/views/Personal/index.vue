<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title>个人中心</ion-title>
          <ion-buttons slot="end">
            设置
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <PersonalCard/>
      <div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonPage, IonContent, IonHeader, IonToolbar, IonButtons, IonTitle } from '@ionic/vue'
import { defineComponent } from "vue";
import PersonalCard from './components/PersonalCard'
export default defineComponent({
  name: 'Personal',
  components: {
    IonPage,
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonTitle,
    PersonalCard
  }
})
</script>

<style>
</style>