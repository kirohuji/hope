<template>
  <ion-content>
    <ion-list>
      <ion-item
        v-for="(item,index) in toc"
        :key="index"
        @click="onNodeClick(item)"
      >
        {{item.label}}
      </ion-item>
    </ion-list>
  </ion-content>
</template>

<script>
import {
  IonContent,
  IonList,
  IonItem
} from '@ionic/vue'
export default {
  name: 'tocMenu',
  components: {
    IonContent,
    IonList,
    IonItem
  },
  props: {
    theme: {
      default: "default",
      type: String,
    },
    toc: {
      type: Array,
      default: () => [],
    },
  },
  //   mounted () {
  //     console.log(this.toc)
  //   },
  methods: {
    onNodeClick (data) {
      this.$emit('node-click', data)
    }
  }
}
</script>

<style scoped>
</style>