<template>
  <ion-page>
    <!-- <ion-header>
      <ion-toolbar>
        <ion-title>Tab 2</ion-title>
      </ion-toolbar>
    </ion-header> -->
    <ion-tabs>
      <ion-router-outlet class="inner-router"></ion-router-outlet>
      <!-- 底部导航 -->
      <ion-tab-bar slot="bottom">
        <ion-tab-button
          tab="library"
          href="/main/library"
        >
          <ion-icon :icon="libraryOutline" />
          <ion-label>阅读</ion-label>
        </ion-tab-button>

        <ion-tab-button
          tab="personal"
          href="/main/personal"
        >
          <ion-icon :icon="personOutline" />
          <ion-label>自己</ion-label>
        </ion-tab-button>

      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script lang="ts">
import {
  IonTabBar,
  // IonHeader,
  // IonTitle,
  // IonToolbar,
  IonTabButton,
  IonTabs,
  IonLabel,
  IonIcon,
  IonPage,
  IonRouterOutlet,
} from "@ionic/vue";
import { libraryOutline, personOutline } from "ionicons/icons";

export default {
  name: "Tabs",
  components: {
    // IonHeader,
    // IonTitle,
    // IonToolbar,
    IonLabel,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonPage,
    IonRouterOutlet,
  },
  setup() {
    return {
      libraryOutline,
      personOutline,
    };
  },
};
</script>
