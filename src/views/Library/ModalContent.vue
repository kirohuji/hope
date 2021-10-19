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
    <ion-list>
      <!-- <ion-list-header>
        <ion-label>Recent</ion-label>
      </ion-list-header> -->
      <ion-item>
        <ion-label>主题</ion-label>
        <ion-select
          multiple="true"
          cancel-text="取消"
          ok-text="确定!"
          v-model="topics"
          :selectedText="topics.map(item=>item.label)"
        >
          <ion-select-option
            compareWith="value"
            :value="option"
            v-for="(option,index) in options"
            :key="index"
          >{{option.label}}</ion-select-option>
        </ion-select>
      </ion-item>
    </ion-list>
    <ion-footer style="position: absolute;bottom: 0;">
      <ion-button
        expand="block"
        @click="handleSubmit"
      >确定</ion-button>
    </ion-footer>
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
  IonList,
  //   IonListHeader,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonLabel,
  IonFooter,
  IonButton,
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
    IonList,
    // IonListHeader,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonFooter,
    IonButton,
  },
  name: "Modal",
  props: {
    title: { type: String, default: "Super Modal" },
  },
  setup() {
    return {
      closeOutline,
      options: [
        {
          label: "10月份",
          value: "2021.10+",
        },
      ],
    };
  },
  data() {
    return {
      topics: [],
      content: "Content",
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
