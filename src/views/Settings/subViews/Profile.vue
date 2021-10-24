<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-header>
        <ion-toolbar>
          <ion-title>编辑资料</ion-title>
          <ion-buttons slot="start">
            <ion-back-button href="/settings"></ion-back-button>
          </ion-buttons>
          <ion-buttons
            slot="end"
            @click="submit"
          >
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
            <img :src="current.profile.picture || '/madison.jpg'">
          </ion-avatar>
        </ion-item>
        <ion-item>
          <ion-label>名字</ion-label>
          <ion-input
            slot="end"
            class="name"
            v-model="current.profile.displayName"
          ></ion-input>
        </ion-item>
        <ion-item>
          <ion-label>性别</ion-label>
          <ion-select
            placeholder="Select One"
            v-model="current.profile.sex"
          >
            <ion-select-option value="f">女</ion-select-option>
            <ion-select-option value="m">男</ion-select-option>
          </ion-select>
        </ion-item>
        <ion-item detail>
          <ion-label>生日</ion-label>
          <ion-datetime
            v-model="current.profile.birthday"
            display-format="MM/DD/YYYY"
            min="1994-03-14"
            max="3000-12-09"
          ></ion-datetime>

        </ion-item>
        <!-- <ion-item detail>
          <ion-label>地域</ion-label>
        </ion-item> -->
        <ion-item lines="inset">
          <ion-label>个人描述</ion-label>
          <ion-textarea
            autoGrow
            v-model="current.profile.remark"
          ></ion-textarea>
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
  IonSelectOption,
  toastController
} from '@ionic/vue'
import { defineComponent } from "vue";
import { arrowBackOutline } from "ionicons/icons"
import { useRouter } from "vue-router";
import Avatar from './Avatar.vue'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { mapGetters } from 'vuex'
import _ from 'lodash'
import { service } from '../services'
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
      toast: '',
      current: {
        profile: {}
      }
    }
  },
  setup () {
    const router = useRouter();
    return {
      arrowBackOutline,
      router
    }
  },
  computed: {
    ...mapGetters([
      'currentUser'
    ])
  },
  ionViewDidEnter () {
    this.init(this.currentUser)
  },
  methods: {
    init (data) {
      this.current = _.pick(_.cloneDeep(data), ['profile'])
    },
    async openToast () {
      const toast = await toastController
        .create({
          message: '正在更新用户信息',
          duration: 5000
        })
      return toast.present();
    },
    submit () {
      this.toast = this.openToast()
      service.save(this.current).then(res => {
        // debugger
        if (res.status === 200) {
          service.current().then((res2) => {
            if (res2.status === 200) {
              this.$store.commit("currentUser", res2.data);
              this.init(res2.data)
              this.toast.dismiss()
            }
          });
        }
      })
    },
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