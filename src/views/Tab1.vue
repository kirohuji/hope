<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tab 2</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-header collapse="condense">
      <ion-toolbar>
        <ion-title size="large">Tab 2</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-fab
        vertical="bottom"
        horizontal="center"
        slot="fixed"
      >
        <ion-fab-button @click="takePhoto()">
          <ion-icon :icon="camera"></ion-icon>xw
        </ion-fab-button>
      </ion-fab>
      <ion-tab-button
        tab="tab2"
        href="/tabs/tab2"
      >
        <ion-icon :icon="images" />
        <ion-label>Photos</ion-label>
      </ion-tab-button>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { camera, trash, close } from "ionicons/icons";
import {
  IonPage,
  IonHeader,
  IonFab,
  IonFabButton,
  IonIcon,
  IonToolbar,
  IonTitle,
  IonContent,
  // IonGrid,
  // IonRow,
  // IonCol,
  // IonImg,
} from "@ionic/vue";
// import ExploreContainer from "../components/ExploreContainer.vue";

export default {
  name: "Tab1",
  components: {
    IonPage,
    IonHeader,
    IonFab,
    IonFabButton,
    IonIcon,
    IonToolbar,
    IonTitle,
    IonContent,
    // IonGrid,
    // IonRow,
    // IonCol,
    // IonImg,
  },
  setup() {
    return {
      camera,
      trash,
      close,
    };
  },
};
</script>