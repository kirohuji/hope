<template>
  <div>
    <div class="info-layout">
      <pan-thumb
        image="/madison.jpg"
        height="68px"
        width="68px"
        :hoverable="false"
        @click="imagecropperShow = true"
      />
      <b>Lourd</b>
    </div>
    <ion-modal
      :is-open="imagecropperShow"
      css-class="image-modal"
      swipeToClose
      @onDidDismiss="imagecropperShow=false"
    >
      <image-cropper
        v-show="imagecropperShow"
        :key="imagecropperKey"
        :width="300"
        :height="300"
        url="https://httpbin.org/post"
        lang-type="en"
        @close="close"
        @crop-upload-success="cropSuccess"
      />
    </ion-modal>

  </div>
</template>

<script>
import PanThumb from '@/components/PanThumb'
import ImageCropper from "@/components/ImageCropper";
import {  IonModal } from '@ionic/vue' 
export default {
  components: {
    PanThumb,
    ImageCropper,
    IonModal
  },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: "",
          email: "",
          avatar: "",
          role: "",
        };
      },
    },
  },
  data () {
    return {
      imagecropperShow: false,
      imagecropperKey: 0,
      image: "https://wpimg.wallstcn.com/577965b9-bb9e-4e02-9f0c-095b41417191",
    };
  },
  methods: {
    cropSuccess (resData) {
      this.imagecropperShow = false;
      this.imagecropperKey = this.imagecropperKey + 1;
      this.image = resData.files.avatar;
    },
    close () {
      this.imagecropperShow = false;
    },
  },
}
</script>

<style scoped>
.info-layout {
  position: absolute;
  z-index: 10;
  top: calc(45% - 62px);
  left: calc(55% - 60px);
  text-align: center;
  color: azure;
  font-size: 16px;
  display: flex;
  flex-direction: column;
}
img {
  border: 2px solid;
  box-shadow: rgb(255 255 255 / 24%) 0px 2px 16px;
}
</style>