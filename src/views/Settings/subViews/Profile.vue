<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-header>
        <ion-toolbar>
          <ion-title>编辑资料</ion-title>
          <ion-buttons slot="start">
            <ion-back-button href="/settings"></ion-back-button>
          </ion-buttons>
          <ion-buttons slot="end">
            保存
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-list>
        <ion-item
          detail
          @click="takeProfilePicture"
        >
          <ion-label>头像</ion-label>
          <ion-avatar
            slot="end"
            size="large"
          >
            <img src="/madison.jpg">
          </ion-avatar>
        </ion-item>
        <ion-item>
          <ion-label>名字</ion-label>
          <ion-input
            slot="end"
            class="name"
          ></ion-input>
        </ion-item>
        <ion-item>
          <ion-label>性别</ion-label>
          <ion-select placeholder="Select One">
            <ion-select-option value="f">女</ion-select-option>
            <ion-select-option value="m">男</ion-select-option>
          </ion-select>
        </ion-item>
        <ion-item detail>
          <ion-label>生日</ion-label>
          <ion-datetime
            display-format="MM/DD/YYYY"
            min="1994-03-14"
            max="2012-12-09"
          ></ion-datetime>

        </ion-item>
        <ion-item detail>
          <ion-label>地域</ion-label>
        </ion-item>
        <ion-item lines="inset">
          <ion-label>个人描述</ion-label>
          <ion-textarea autoGrow></ion-textarea>
        </ion-item>
      </ion-list>
    </ion-content>
    <ion-modal
      :is-open="avatarVisible"
      css-class="avatar-modal"
      swipeToClose
      @onDidDismiss="avatarVisible=false"
    >
      <Avatar
        @close="avatarVisible=false"
        title="头像"
      />
    </ion-modal>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonBackButton,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonDatetime,
  IonAvatar,
  IonModal,
  IonSelect,
  IonSelectOption
} from '@ionic/vue'
import { defineComponent } from "vue";
import { arrowBackOutline } from "ionicons/icons"
import { useRouter } from "vue-router";
import Avatar from './Avatar.vue'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

export default defineComponent({
  name: 'Profile',
  components: {
    IonPage,
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonTitle,
    IonBackButton,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonDatetime,
    IonAvatar,
    IonSelect,
    IonModal,
    IonSelectOption,
    Avatar
    // IonListHeader
  },
  data () {
    return {
      avatarVisible: false,
      image: '',
    }
  },
  setup () {
    const router = useRouter();
    return {
      arrowBackOutline,
      router
    }
  },
  methods: {
    async takeProfilePicture () {
      // Take a picture or video, or load from the library
      this.image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera
      });
    }
  }
})
</script>

<style scoped>
ion-back-button {
  display: block;
}
ion-avatar {
  width: 55px;
  height: 55px;
  --border-radius: 10%;
}
.name {
  text-align: right !important;
}
</style>