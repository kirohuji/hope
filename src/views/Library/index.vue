<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-grid>
            <ion-row>
              <ion-col size="1">
                <ion-icon :icon="notificationsOutline"></ion-icon>
              </ion-col>
              <ion-col size="10">
                <ion-searchbar />
              </ion-col>
              <ion-col size="1">
                <ion-icon
                  :icon="optionsOutline"
                  @click="setOpen(true)"
                ></ion-icon>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-toolbar>
      </ion-header>
      <div class="filters">
        <span class="filters-title">表示中:</span>
        <ion-badge v-for="(tag,i) in filter.topics" :key="i">{{tag.label}}{{filter.topics.length===(i-1) ? ',' : ''}}</ion-badge>
      </div>
      <!-- <ExploreContainer name="Tab 1 page" /> -->
      <ion-segment v-model="selectedType">
        <ion-segment-button value="all">
          <ion-label>すべて</ion-label>
        </ion-segment-button>
        <ion-segment-button value="downloaded">
          <ion-label>ダウンロード済み</ion-label>
        </ion-segment-button>
      </ion-segment>
      <ion-list>
        <ion-list-header v-if="selectedType === 'downloaded'">
          <ion-label>Recent</ion-label>
        </ion-list-header>
        <ion-item v-if="selectedType === 'downloaded'">
          <ion-thumbnail slot="start">
            <img
              style="height:100px"
              src="https://semantic-ui.com/images/avatar2/large/kristy.png"
            />
          </ion-thumbnail>
          <ion-label>Pokémon Yellow</ion-label>
        </ion-item>
        <ion-list-header>
          <ion-label>List</ion-label>
        </ion-list-header>
        <ion-item>
          <ion-thumbnail slot="start">
            <img
              style="height:100px"
              src="https://semantic-ui.com/images/avatar2/large/kristy.png"
            />
          </ion-thumbnail>
          <ion-label>
            <ion-badge
              style="float:right"
              color="success"
            >已经下载</ion-badge>
            <h2>ECMAScript 6 入门</h2>
            <p>阮一峰</p>
            <h3>
              <ion-progress-bar value="0.5"></ion-progress-bar>
              50%
            </h3>
            <h3>
              <ion-chip>
                <ion-label>10月份</ion-label>
              </ion-chip>
            </h3>
          </ion-label>
        </ion-item>
      </ion-list>
      <ion-modal
        :is-open="isOpenRef"
        css-class="filter-modal"
        swipeToClose
        @onDidDismiss="setOpen(false)"
      >
        <Modal
          :data="data"
          @close="handleClose"
          @submit="handleFilter"
          title="过滤器"
        ></Modal>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  //   IonTitle,
  IonContent,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonSearchbar,
  IonList,
  IonListHeader,
  IonItem,
  IonThumbnail,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonProgressBar,
  IonBadge,
  IonChip,
  IonModal,
} from "@ionic/vue";
import { notificationsOutline, optionsOutline } from "ionicons/icons";
import { ref } from "vue";
import Modal from "./ModalContent.vue";
import { defineComponent } from "vue";
// import ExploreContainer from "../../components/ExploreContainer.vue";
interface Filter {
  topics: any;
}
export default defineComponent({
  name: "Library",
  components: {
    // ExploreContainer,
    IonSearchbar,
    IonHeader,
    IonToolbar,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonThumbnail,
    IonListHeader,
    IonContent,
    IonPage,
    IonList,
    IonItem,
    IonLabel,
    IonSegment,
    IonSegmentButton,
    IonProgressBar,
    IonBadge,
    IonChip,
    IonModal,
    Modal,
  },
  data() {
    return {
      filter: {
        topics: [],
      },
      selectedType: "downloaded",
    };
  },
  setup() {
    const isOpenRef = ref(false);
    const setOpen = (state: boolean) => (isOpenRef.value = state);
    const data = { content: "New Content" };
    return {
      isOpenRef,
      setOpen,
      data,
      notificationsOutline,
      optionsOutline,
    };
  },
  methods: {
    handleClose() {
      this.setOpen(false);
    },
    handleFilter(filter: Filter) {
      this.filter = filter;
      this.setOpen(false);
      console.log(this.filter);
    },
  },
});
</script>
<style>
.modal-wrapper {
  position: absolute;
  bottom: 0;
  height: 40%;
}
</style>
<style scoped>
ion-segment {
  border-radius: 0;
}
ion-icon {
  margin-top: 4px;
  font-size: 24px;
}
ion-thumbnail {
  height: 100px;
  width: 80px;
}
.filters {
  height: 30px;
  background: rgba(0, 0, 0, 0.067);
  /* border-top: solid 1px rgba(0, 0, 0, 0.767); */
  border-bottom: solid 1px rgba(0, 0, 0, 0.167);
  display: flex;
  align-items: center;
}
.filters .filters-title {
  font-size: 14px;
  margin: 0 8px;
}
</style>
