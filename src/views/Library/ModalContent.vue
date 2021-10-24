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
          v-model="select"
          :selectedText="select"
        >
          <ion-select-option
            compareWith="_id"
            :value="option.value"
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

<script>
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
import { appServicesService } from "./service";
import _ from 'lodash'
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
    topics: {
      type: Array,
      default: () => []
    },
    title: { type: String, default: "Super Modal" },
    visible: Boolean
  },
  setup () {
    return {
      closeOutline,
    };
  },
  data () {
    return {
      options: [],
      select: [],
      content: "Content",
    };
  },
  async created () {
    await this.setTopics()
  },
  methods: {
    handleCompare (current, compare) {
      console.log(current, compare)
    },
    setTopics () {
      appServicesService.user().then((res) => {
        if (res.status === 200) {
          const services = res.data[0].services;
          this.options = _.flatten(_.union(_.compact(services.map(item => {
            return item.topics || null;
          }))))
          this.select = this.topics
        }
      });
    },
    handleSubmit () {
      this.$emit("submit", {
        topics: this.select,
      });
    },
  },
};
</script>
<style scoped>
ion-footer {
  margin-bottom: var(--ion-safe-area-bottom);
}
</style>