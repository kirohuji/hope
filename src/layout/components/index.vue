<template>
  <ion-tab-bar slot="bottom">
    <ion-tab-button tab="tab1" href="/tabs/tab1">
      <ion-icon :icon="triangle" />
      <ion-label>Tab 1</ion-label>
    </ion-tab-button>

    <ion-tab-button tab="tab2" href="/tabs/tab2">
      <ion-icon :icon="ellipse" />
      <ion-label>Tab 2</ion-label>
    </ion-tab-button>
  </ion-tab-bar>
</template>

<script lang="ts">
import {
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonLabel,
  IonIcon,
} from "@ionic/vue";
import { ellipse, square, triangle } from "ionicons/icons";

export default {
  name: "Tabs",
  components: {
    IonLabel,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
  },
  setup() {
    return {
      ellipse,
      square,
      triangle,
    };
  },
};
</script>
