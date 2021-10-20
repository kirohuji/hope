<template>
  <ion-content :fullscreen="true">
    <ion-header collapse="condense">
      <ion-toolbar>
        <ion-title>{{ title }}</ion-title>
        <ion-buttons slot="end">
          <ion-icon
            :icon="closeOutline"
            @click="$emit('close')"
            size="large"
          />
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <div>
      <ion-img src="/madison.jpg"></ion-img>
    </div>
  </ion-content>
</template>

<script lang="ts">
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonIcon,
  IonImg,
} from "@ionic/vue";
import { closeOutline } from "ionicons/icons";
export default {
  components: {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonIcon,
    IonImg,
  },
  name: "Modal",
  props: {
    title: { type: String, default: "Super Modal" },
  },
  setup() {
    const items = [
      {
        text: "Item 1",
        src: "/path/to/external/file.png",
      },
      {
        text: "Item 2",
        src: "/path/to/external/file.png",
      },
      {
        text: "Item 3",
        src: "/path/to/external/file.png",
      },
    ];
    return {
      items,
      closeOutline,
    };
  },
  methods: {
    handleSubmit() {
      (this as any).$emit("submit", {
        topics: (this as any).topics,
      });
    },
  },
};
</script>
<style>
ion-img {
  width: 100vw;
  height: 100vw;
}
</style>