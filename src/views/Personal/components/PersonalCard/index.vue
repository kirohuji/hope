<template>
  <div>
    <ion-card>
      <Backgrond/>
      <Avatar/>
    </ion-card>
    <ion-segment>
      <ion-segment-button value="friends">
        <ion-label>被关注</ion-label>
      </ion-segment-button>
      <ion-segment-button value="enemies">
        <ion-label>关注的人</ion-label>
      </ion-segment-button>
      <ion-segment-button value="has">
        <ion-label>已发表</ion-label>
      </ion-segment-button>
    </ion-segment>
  </div>
</template>

<script>
import { IonCard, IonSegment, IonSegmentButton, IonLabel } from '@ionic/vue'
import Avatar from '../Avatar.vue'
import Backgrond from '../Background.vue'
export default {
  components: {
    IonCard,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    Avatar,
    Backgrond
  }
}
</script>

<style scoped>
ion-card {
  margin: 0 !important;
  border-radius: 0 !important;
}
ion-segment {
  border-radius: 0;
  border-bottom: 1px solid rgb(212, 212, 212);
}


</style>
