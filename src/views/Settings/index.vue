<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-header>
        <ion-toolbar>
          <ion-title>设置</ion-title>
          <ion-buttons slot="start">
            <ion-back-button href="/main/personal"></ion-back-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-list>
        <!-- <ion-list-header>
          <ion-label>账户和安全</ion-label>
        </ion-list-header> -->
        <ion-item
          detail
          @click="router.push('/profile')"
        >
          <ion-label>账户和安全</ion-label>
        </ion-item>
        <!-- <ion-item detail>
          <ion-label>意见反馈</ion-label>
        </ion-item>
        <ion-item detail>
          <ion-label>关于Hope</ion-label>
        </ion-item> -->
        <ion-item>
          <ion-label @click="logout">退出登录</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
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
  //   IonListHeader
} from '@ionic/vue'
import { defineComponent } from "vue";
import { arrowBackOutline } from "ionicons/icons"
import { useRouter } from "vue-router";
export default defineComponent({
  name: 'Personal',
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
    // IonListHeader
  },
  setup () {
    const router = useRouter();
    return {
      arrowBackOutline,
      router
    }
  },
  methods: {
    logout () {
      localStorage.clear()
      this.router.push('/login')
    }
  }
})
</script>

<style scoped>
ion-back-button {
  display: block;
}
</style>