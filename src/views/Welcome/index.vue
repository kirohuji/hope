<template>
  <ion-page>
    <ion-content>
      <ion-slides
        pager="true"
        :options="slideOpts"
      >
        <ion-slide>
          <img src="/slide-1.png">
          <h2>Welcome</h2>
          <p>The
            <b>ionic conference app</b>
            is a practical preview of the ionic framework in action, and a demonstration of proper code use.
          </p>
        </ion-slide>
        <ion-slide>
          <img src="/slide-2.png">
          <h2>What is Ionic?</h2>
          <p>The
            <b>Ionic Framework</b>
            is an open source SDK that enables developers to build high quality mobile apps with web technologies like HTML, CSS, and JavaScript.
          </p>
        </ion-slide>
        <ion-slide>
          <img src="/slide-3.png">
          <h2>What is Appflow?</h2>
          <p>The
            <b>Appflow</b>
            is a powerful set of services and features built on top of Ionic Framework that brings a totally new level of app development agility to mobile dev teams.
          </p>
        </ion-slide>
        <ion-slide>
          <img src="/slide-4.png">
          <h2>Ready to Play?</h2>
          <ion-button
            fill="clear"
            @click="router.push('/main/library')"
          >
            Continue
            <ion-icon
              slot="end"
              :icon="arrowForwardOutline"
            ></ion-icon>
          </ion-button>
        </ion-slide>
      </ion-slides>
    </ion-content>
  </ion-page>
</template>


<script>
import { IonSlides, IonSlide, IonButton, IonIcon, IonPage, IonContent } from '@ionic/vue';
import { arrowForwardOutline } from 'ionicons/icons'
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
// import { useIonRouter } from '@ionic/vue';
export default defineComponent({
  components: { IonSlides, IonSlide, IonButton, IonIcon, IonPage, IonContent },
  setup () {
    // Optional parameters to pass to the swiper instance. See http://idangero.us/swiper/api/ for valid options.
    const slideOpts = {
      initialSlide: 1,
      speed: 400
    };
    // const ionRouter = useIonRouter();
    const router = useRouter();
    return { slideOpts, arrowForwardOutline, router }
  }
});
</script>
<style scoped>
.swiper-container {
  height: 100%;
}
.swiper-slide {
  flex-direction: column;
}
.swiper-slide img {
  max-height: 50%;
  width: auto;
  max-width: 80%;
  margin: 60px 0 40px;
  pointer-events: none;
}
.swiper-slide h2 {
  margin-top: 2.8rem;
}
p {
  padding: 0 40px;
  font-size: 14px;
  line-height: 1.5;
  color: var(--ion-color-step-600, #60646b);
}
p b {
  color: var(--ion-text-color, #000000);
}
ion-content{
  margin-bottom: var(--ion-safe-area-bottom);
}
</style>