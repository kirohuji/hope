<template>
  <ion-content>
    <ion-list>
      <ion-item
        v-for="(item,index) in bookmarks"
        :key="index"
      >
        <ion-label @click="onNodeClick(item)">{{item.label}}</ion-label>
        <ion-icon
          :icon="closeCircleOutline"
          slot="end"
          @click="() => removeBookmark(item)"
        ></ion-icon>
      </ion-item>
    </ion-list>
  </ion-content>

</template>

<script>
import {
  IonContent,
  IonList,
  IonIcon,
  IonItem,
  IonLabel
} from '@ionic/vue'
import {
  closeCircleOutline
} from 'ionicons/icons'
export default {
  name: 'tocMenu',
  components: {
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonIcon
  },
  props: {
    theme: {
      default: "default",
      type: String,
    },
    bookmarks: {
      type: Array,
      default: () => [],
    },
  },
  setup () {
    return {
      closeCircleOutline
    }
  },
  methods: {
    onNodeClick (data) {
      this.$emit('node-click', data)
    },
    removeBookmark (data) {
      this.$emit("remove-bookmark", data);
    },
  }
}
</script>

<style>
</style>