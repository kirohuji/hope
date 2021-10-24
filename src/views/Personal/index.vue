<template>
  <ion-page>
    <ion-content
      :fullscreen="true"
      class="center"
    >
      <!-- <img src="/madison.jpg" class="background-layout"> -->
      <ion-list>
        <div>
          <!-- <img
            src="/madison.jpg"
            class="background-layout"
          > -->
          <ion-item
            lines="none"
            class="avatar"
          >
            <ion-avatar
              slot="start"
              size="large"
            >
              <img :src="currentUser.profile.picture || '/madison.jpg'">
            </ion-avatar>
            <ion-label>
              <h1><b>{{currentUser.profile.displayName}}</b></h1>
              <p>手机号: {{currentUser.phone}}</p>
              <p>签名:{{currentUser.profile.remark}}</p>
            </ion-label>
          </ion-item>
          <!-- <ion-item
            lines="full"
            detail
          >
            支付与安全
          </ion-item> -->
          <ion-item
            lines="full"
            detail
            @click="router.push('/settings')"
          >
            设置
          </ion-item>
        </div>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonContent,
  IonAvatar,
  IonList,
  IonItem,
  IonLabel,
  //   IonButton
  //   IonListHeader
} from '@ionic/vue'
import { defineComponent } from "vue";
import { arrowBackOutline } from "ionicons/icons"
import { useRouter } from "vue-router";
import { mapGetters } from 'vuex'
export default defineComponent({
  name: 'Personal',
  components: {
    IonPage,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonAvatar,
    // IonButton
    // IonListHeader
  },
  computed: {
    ...mapGetters([
      'currentUser'
    ])
  },
  setup () {
    const router = useRouter();
    return {
      arrowBackOutline,
      router
    }
  }
})
</script>

<style scoped>
ion-avatar {
  width: 55px;
  height: 55px;
  --border-radius: 10%;
}
ion-item.avatar {
  align-items: baseline;
  padding-top: 25px;
  margin-top: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgb(221, 221, 221);
}
/* ion-content{
  background-color: #d7d7d759 !important;
} */
.item.sc-ion-label-ios-h,
.item .sc-ion-label-ios-h {
  margin-top: -5px;
}
/* .background-layout {
  position: absolute;
  top: -100px;
} */
</style>