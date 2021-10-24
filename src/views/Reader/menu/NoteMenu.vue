<template>
  <ion-content :fullscreen="true">
    <ion-header collapse="condense">
      <ion-toolbar>
        <ion-title>{{ title }}</ion-title>
        <ion-icon
          :icon="saveOutline"
          @click="handleSubmit"
          slot="start"
        />
        <ion-buttons slot="end">
          <ion-icon
            :icon="closeOutline"
            @click="$emit('close')"
          />
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <div class="tinymce-layout">
      <Tinymce
        ref="editor"
        height="100vh"
        menubar=""
        width="100%"
        :value="content"
      />
    </div>
  </ion-content>
</template>

<script>
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonIcon,
} from "@ionic/vue";
import { closeOutline, saveOutline } from "ionicons/icons";
import Tinymce from "@/components/Tinymce/index.vue";
export default {
  components: {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonIcon,
    Tinymce,
  },
  name: "Modal",
  props: {
    title: { type: String, default: "Super Modal" },
    content: {
      type: String,
      default: "",
    },
  },
  setup () {
    return {
      closeOutline,
      saveOutline
    };
  },
  methods: {
    handleSubmit () {
      window.tinyClose = true;
      const content = window.tinymce.activeEditor.getContent();
      this.$emit("save", content);
    },
  },
};
</script>
<style scoped>
ion-icon {
  /* margin-top: 4px; */
  font-size: 24px;
  margin: 8px;
}
ion-header {
  margin-top: var(--ion-safe-area-top);
  /* margin-bottom: var(--ion-safe-area-bottom); */
}
.tinymce-layout {
  height: 100%;
  margin-bottom: var(--ion-safe-area-bottom);
}
</style>