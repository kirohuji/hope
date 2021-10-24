<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-grid>
            <ion-row>
              <!-- <ion-col size="1">
                <ion-icon :icon="notificationsOutline"></ion-icon>
              </ion-col> -->
              <ion-col size="11">
                <ion-searchbar v-model="filter.name" />
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
        <div style="display:flex">
          <span class="filters-title">表示中:</span>
          <ion-badge
            v-for="(tag,i) in filter.topics"
            :key="i"
          >{{tag}}{{filter.topics.length===(i-1) ? ',' : ''}}</ion-badge>
        </div>
        <ion-icon
          v-if="filter.topics.length"
          style="margin-top: 0"
          :icon="closeCircleOutline"
          @click="clearFilter"
        ></ion-icon>
      </div>
      <!-- <ExploreContainer name="Tab 1 page" /> -->
      <ion-segment
        v-model="selectedType"
        @ionChange="fetchByType(selectedType)"
      >
        <ion-segment-button value="All">
          <ion-label>すべて</ion-label>
        </ion-segment-button>
        <ion-segment-button value="Downloaded">
          <ion-label>ダウンロード済み</ion-label>
        </ion-segment-button>
      </ion-segment>
      <BookList
        :list="books"
        @refresh="fetchByType(type)"
      />
      <ion-modal
        :is-open="isOpenRef"
        css-class="filter-modal"
        swipeToClose
        @onDidDismiss="setOpen(false)"
      >
        <Modal
          :data="data"
          v-if="isOpenRef"
          :topics="filter.topics"
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
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonModal,
} from "@ionic/vue";
import {
  notificationsOutline,
  optionsOutline,
  closeCircleOutline,
} from "ionicons/icons";
import { ref } from "vue";
import Modal from "./ModalContent.vue";
import { defineComponent } from "vue";
import { service } from "./service";
import localforage from "localforage";
import _ from "lodash";
import BookList from "./BookList.vue";
// import ExploreContainer from "../../components/ExploreContainer.vue";
interface Filter {
  topics: any;
  name: string;
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
    IonContent,
    IonPage,
    IonLabel,
    IonSegment,
    IonSegmentButton,
    // IonChip,
    IonModal,
    BookList,
    Modal,
  },
  data() {
    return {
      filter: {
        topics: [],
        name: "",
      },
      booksKey: 1,
      selectedType: "All",
      books: [],
      loading: false,
      type: "All",
      bookList: [],
      group: {},
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
      closeCircleOutline,
      notificationsOutline,
      optionsOutline,
    };
  },
  watch: {
    "filter.name"(val) {
      // _.debounce(this.fetchByType(this.selectedType),1000);
      this.fetchByType(this.selectedType);
    },
  },
  mounted() {
    this.fetchByType = _.debounce(this.fetchByType, 500);
    this.fetchByType(this.selectedType);
  },
  methods: {
    fetchByType(type: string) {
      console.log(type);
      // this.books = [];
      switch (type) {
        case "All":
          this.fetchAllData();
          break;
        case "Repository":
          this.fetchData();
          break;
        case "Downloaded":
          this.loadData();
          break;
      }
      this.booksKey++;
    },
    fetchAllData() {
      this.loading = true;
      this.books = [];
      Promise.all([
        service.findBooksWithPosts(this.filter),
        localforage.getItem("books"),
      ]).then(([remoteBooks, localBooks]: any) => {
        // debugger
        if (!localBooks) {
          localBooks = [];
        }
        (this as any).books = _.unionBy(localBooks, remoteBooks.data, "md5");
        // debugger
        this.group = _.groupBy(this.books, "tag");
        this.loading = false;
      });
    },
    fetchData() {
      this.loading = true;
      this.books = [];
      Promise.all([
        service.findBooksWithPosts(this.filter),
        localforage.getItem("books"),
      ]).then(([remoteBooks, localBooks]: any) => {
        if (!localBooks) {
          localBooks = [];
        }
        (this as any).books = _.differenceBy(remoteBooks, localBooks, "md5");
        this.group = _.groupBy(this.books, "tag");
        this.loading = false;
      });
    },
    loadData() {
      this.loading = true;
      this.books = [];
      localforage.getItem("books").then((books: any) => {
        if (books === null) {
          books = [];
        }
        (this as any).books = books;
        this.group = _.groupBy(this.books, "tag");
        this.loading = false;
      });
    },
    handleClose() {
      this.setOpen(false);
    },
    clearFilter() {
      this.filter = {
        topics: [],
        name: this.filter.name,
      };
      this.fetchByType(this.selectedType);
    },
    handleFilter(filter: Filter) {
      this.filter = filter;
      this.setOpen(false);
      this.fetchByType(this.selectedType);
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
.filters {
  height: 30px;
  background: rgba(0, 0, 0, 0.067);
  /* border-top: solid 1px rgba(0, 0, 0, 0.767); */
  border-bottom: solid 1px rgba(0, 0, 0, 0.167);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.filters .filters-title {
  font-size: 14px;
  margin: 0 8px;
}
/* ion-header {
  margin-top: var(--ion-safe-area-top);
} */
</style>
