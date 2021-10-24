<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-header>
        <ion-toolbar>
          <ion-title>登录</ion-title>
        </ion-toolbar>
      </ion-header>
      <img src="/slide-1.png">
      <div style="margin: 16px 16px">

        <ion-input
          class="login-input"
          clear-input
          placeholder="手机号、邮件、用户名"
          v-model="account.username"
        ></ion-input>

        <ion-input
          class="login-input"
          clear-input
          placeholder="密码"
          v-model="account.password"
        ></ion-input>
        <ion-input
          class="login-input"
          clear-input
          placeholder="确定密码"
          v-model="account.confirm"
          v-if="mode==='register'"
        ></ion-input>
        <div>
          <ion-button
            expand="block"
            @click="submit"
          >{{mode==="login"?"登录":"注册"}}</ion-button>
        </div>
        <div class="divider">
          <div class="divider-text">or</div>
        </div>
        <div>
          <ion-button
            expand="block"
            @click="changeMode"
          >{{mode==="login"?"注册":"登录"}}</ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonInput,
  IonButton,
  toastController
} from '@ionic/vue'
import { defineComponent } from "vue";
import { arrowBackOutline } from "ionicons/icons"
import { service, authService } from "./service";
import { useRouter } from "vue-router";
export default defineComponent({
  name: 'Personal',
  components: {
    IonPage,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonInput
  },
  setup () {
    const router = useRouter();
    return {
      arrowBackOutline,
      router
    }
  },
  data () {
    return {
      account: {
        password: '',
        username: '',
      },
      mode: 'login'
    }
  },
  methods: {
    async openToast (title) {
      const toast = await toastController
        .create({
          message: title,
          duration: 2000
        })
      return toast.present();
    },
    submit () {
      if (this.mode === 'login') {
        authService.login(this.account).then((res) => {
          localStorage.setItem("user", JSON.stringify(res.data));
          this.openToast('登录成功')
          this.router.push('/main/library')
        });
      } else {
        service.insert(this.account).then(() => {
          alert('注册成功')
        });
      }
    },
    changeMode () {
      if (this.mode === 'login') {
        this.mode = "register"
      } else {
        this.mode = "login"
      }
    }
  }
})
</script>

<style scoped>
.login-input {
  background-color: #f1f1f1bf;
  border-radius: 4px;
  --padding-start: 8px !important;
  /* padding-left: 8px !important; */
  margin-bottom: 16px;
}
img {
  max-height: 50%;
  width: auto;
  max-width: 90%;
  margin: 10px 40px;
  /* margin: auto; */
  pointer-events: none;
}
ion-back-button {
  display: block;
}
.divider {
  width: 100%;
  height: 1px;
  margin-top: 16px;
  margin-bottom: 16px;
  position: relative;
  background-color: #b3b3b35c;
}
.divider-text {
  position: absolute;
  background-color: #fff;
  padding: 0 20px;
  color: #303133;
  left: 40%;
  transform: translateY(-50%);
}
</style>