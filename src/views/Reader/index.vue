<template>
  <ion-page>
    <ion-menu
      side="end"
      menu-id="toc"
      content-id="main"
    >
      <ion-toolbar>
        <ion-contnet class="menu-layout">
          <h4>{{title}}</h4>
          <ion-segment
            v-model="menuSelected"
            style="width: 100%"
          >
            <ion-segment-button value="toc">
              目录
            </ion-segment-button>
            <ion-segment-button value="bookmarks">
              书签
            </ion-segment-button>
            <!-- <ion-segment-button value="notes">
              笔记
            </ion-segment-button> -->
          </ion-segment>
        </ion-contnet>
      </ion-toolbar>
      <toc-menu
        :toc="toc"
        :theme="theme"
        v-show="tocKey && menuSelected==='toc'"
        @node-click="onNodeClick"
      />
      <mark-menu
        :bookmarks="info.bookmarks"
        :theme="theme"
        v-show="menuSelected==='bookmarks'"
        @remove-bookmark="removeBookmark"
        @node-click="onNodeClick"
      />
    </ion-menu>
    <ion-header>
      <ion-toolbar>
        <ion-icon
          :icon="exitOutline"
          @click="router.push('/main/library')"
        ></ion-icon>
        <ion-icon
          :icon="returnUpBackOutline"
          @click="onBackBtn"
        ></ion-icon>
        <ion-buttons slot="end">
          <ion-icon
            :icon="readerOutline"
            @click="openMenu('toc')"
          ></ion-icon>
          <ion-icon
            :icon="hasBookMark ? bookmark: bookmarkOutline"
            @click="handleBookMark"
          ></ion-icon>
          <ion-icon
            :icon="createOutline"
            @click="openModal"
          ></ion-icon>
          <!-- <ion-icon :icon="searchOutline"></ion-icon>
          <ion-icon :icon="colorPaletteOutline"></ion-icon> -->
        </ion-buttons>

      </ion-toolbar>
    </ion-header>
    <ion-content
      :fullscreen="true"
      id="main"
    >
      <div id="reader" />
    </ion-content>
    <ion-footer>
      <ion-range
        min="1"
        max="100"
        value="sliderValue"
        :step="0.01"
        @ionChange="onSliderValueChange"
      >
        <ion-icon
          slot="start"
          style="margin-right: 16px;"
          :icon="chevronBackCircleOutline"
          @click="prevPage"
        ></ion-icon>
        <ion-icon
          slot="end"
          :icon="chevronForwardCircleOutline"
          @click="nextPage"
          style="margin-left: 16px;"
        ></ion-icon>
      </ion-range>
    </ion-footer>
    <ion-modal :is-open="modalVisible">
      <NoteMenu
        @close="handleCloseModal"
        :content="note.content"
        @save="handleSaveNote"
        title="写笔记"
      />
    </ion-modal>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonFooter,
  IonIcon,
  IonRange,
  loadingController,
  IonButtons,
  IonMenu,
  toastController,
  menuController,
  IonSegment,
  IonSegmentButton,
  IonModal,
} from "@ionic/vue";

import {
  optionsOutline,
  returnUpBackOutline,
  reorderFourOutline,
  exitOutline,
  bookmarkOutline,
  readerOutline,
  createOutline,
  searchOutline,
  colorPaletteOutline,
  chevronBackCircleOutline,
  chevronForwardCircleOutline,
  bookmark
} from "ionicons/icons";
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import { dark, tan } from "@/utils/themes";
import localforage from "localforage";
import { Book, Rendition } from "epubjs";
import TocMenu from './menu/TocMenu.vue'
import MarkMenu from './menu/BookMarkMenu.vue'
import NoteMenu from './menu/NoteMenu.vue'
import {
  selectListener,
  clickListener,
  swipListener,
  wheelListener,
  keyListener,
} from "@/listener/listener";
import _ from "lodash";
import { notesService } from './service'
export default defineComponent({
  name: "Reader",
  props: ['id'],
  components: {
    IonModal,
    IonHeader,
    IonToolbar,
    IonIcon,
    IonContent,
    IonPage,
    IonRange,
    IonFooter,
    IonButtons,
    IonMenu,
    TocMenu,
    IonSegment,
    IonSegmentButton,
    MarkMenu,
    NoteMenu,
  },
  data () {
    return {
      menuSelected: 'toc',
      loading: false,
      toast: false,
      info: {},
      toc: [],
      tocKey: false,
      flattenedToc: [],
      rendition: {},
      title: '',
      meta: {},
      sliderValue: 0,
      nextSlider: true,
      progress: 0,
      history: [],
      theme: "default",
      styleRules: {},
      currentLocaiont: false,
      modalVisible: false,
      note: {
        content: "",
      },
    };
  },
  setup () {
    return {
      router: useRouter(),
      returnUpBackOutline,
      reorderFourOutline,
      optionsOutline,
      exitOutline,
      bookmarkOutline,
      readerOutline,
      createOutline,
      searchOutline,
      colorPaletteOutline,
      chevronBackCircleOutline,
      chevronForwardCircleOutline,
      bookmark
    };
  },
  computed: {
    hasBookMark () {
      if (this.currentLocaiont && this.info.bookmarks) {
        return _.some(this.info.bookmarks, item => item.cfi == this.currentLocaiont.cfi);
      } else {
        return false
      }
    }
  },
  async mounted () {
    // const { id } = this.router.params;
    // this.bookId = id;
    await this.getInfo(this.id)
    await this.generateBook(this.id);
  },
  methods: {
    handleCloseModal () {
      window.tinyClose = true;
      this.modalVisible = false
    },
    openModal () {
      window.tinyClose = false
      // this.modalVisible = true;
      this.getNode().then(() => {
        this.modalVisible = true;
      })
    },
    handleSaveNote (content) {
      const userId = JSON.parse(localStorage.getItem("user")).userId;
      notesService
        .save({
          ...this.note,
          userId: userId,
          bookId: this.id,
          content,
        })
        .then((res) => {
          this.note = res.data
          // this.$set(this, "note", res);/
        });
    },
    getNode () {
      const userId = JSON.parse(localStorage.getItem("user")).userId;
      return notesService
        .getNoteByBookIdWithUserId({
          userId,
          bookId: this.id,
        })
        .then((res) => {
          // debugger
          this.note = res.data;
        });
    },
    openMenu (menuId) {
      menuController.enable(true, menuId);
      menuController.open(menuId);
    },
    onBackBtn () {
      // remove current location
      this.history.pop();
      const lastLocation = this.history.pop();
      if (lastLocation) {
        this.rendition.display(lastLocation);
      } else {
        // go to homepage
        this.$router.push("/books/index");
      }
    },
    nextPage () {
      this.rendition.next();
    },
    async prevPage () {
      await this.rendition.prev();
    },
    flipPage (direction) {
      if (direction === "next") this.nextPage();
      else if (direction === "prev") this.prevPage();
    },
    async openToast () {
      this.toast = await toastController
        .create({
          message: '书籍下载完成.',
          duration: 2000,
          position: 'middle'
        })
      this.toast.present();
    },
    async presentLoading (title) {
      this.loading = await loadingController
        .create({
          cssClass: 'my-custom-class',
          message: title,
          //   duration: this.timeout,
        });

      this.loading.present();

      //   setTimeout(function () {
      //     loading.dismiss()
      //   }, this.timeout);
    },
    lableFromPercentage (percent) {
      const toc = this.tocFromPercentage(percent);
      if (toc) return toc.label;
      return "";
    },
    updateInfo () {
      localforage.getItem("books").then((bookArr) => {
        if (bookArr == null) {
          bookArr = [];
        }
        for (let i = 0; i < bookArr.length; i++) {
          if (bookArr[i].key === this.info.key) {
            bookArr[i] = this.info;
            break;
          }
        }
        // debugger
        localforage.setItem("books", _.cloneDeep(bookArr));
      });
    },
    // 重新渲染
    refreshRendition () {
      // re-render to apply theme properly
      if (this.rendition.manager) {
        this.rendition.start();
      }
    },
    // 添加样式
    applytheme (theme) {
      this.theme = theme;
      this.rendition.themes.select(theme);
      this.refreshRendition();
      //   this.$bus.emit("theme-change", theme);
    },
    onSliderValueChange (newValue) {
      // this.nextSlider = true
      // if (this.nextSlider) {
      const cfi = this.book.locations.cfiFromPercentage(newValue.detail.value / 100);
      console.log(cfi)
      // debugger
      this.rendition.display(cfi);
      // this.nextSlider = true
      // }
    },
    applyStyle () {
      if (!this.rendition.ready) return;
      this.rendition.getContents().forEach((content) => {
        content.addStylesheetRules(this.styleRules);
      });
    },
    generateRendition (book) {
      return new Rendition(book, {
        width: "100%",
        height: "100%",
      });
    },
    generateToc (toc) {
      const result = (function flatten (items) {
        return [].concat(
          ...items.map((item) => [item].concat(...flatten(item.children)))
        );
      })(toc);
      result.sort((a, b) => {
        return a.percentage - b.percentage;
      });
      return result
    },
    handlerRelocated () {
      this.rendition.on("relocated", (location) => {
        this.info.lastCfi = location.start.cfi;
        this.updateInfo();
        // this.$db.set(this.info.id, this.info);
        this.history.push(location.start.cfi);
        console.log(this.progress)
        this.progress = this.book.locations.percentageFromCfi(
          location.start.cfi
        );
        // this.nextSlider = false
        this.sliderValue = Math.floor(this.progress * 10000) / 100;
        console.log(this.sliderValue)
        // this.nextSlider = true
        this.currentLocaiont = this.rendition.location.start
      });
    },
    handlerRendered () {
      this.rendition.on("rendered", (e, iframe) => {
        // iframe.iframe.contentWindow.focus();
        clickListener(iframe.document, this.rendition, this.flipPage);
        selectListener(iframe.document, this.rendition, this.toggleBuble);
        swipListener(iframe.document, this.flipPage);
        wheelListener(iframe.document, this.flipPage);
        keyListener(iframe.document, this.flipPage);
      });

    },
    generateBook (id) {
      this.presentLoading()
      localforage.getItem(id).then((book) => {
        this.book = new Book(book, "binary");
        // 扁平化目录
        this.flattenedToc = this.generateToc(this.toc)
        // 生成Rendition
        this.rendition = this.generateRendition(this.book)
        this.handlerRendered();
        // 监听书籍重新加载
        this.handlerRelocated();
        // 注册样式
        this.rendition.hooks.content.register(this.applyStyle);
        this.book.ready
          .then(() => {
            this.meta = this.book.package.metadata;
            this.title = this.meta.title;
            /** 第一次生成地址 */
            const key = this.info.key + "-locations";
            const stored = localStorage.getItem(key);
            // debugger
            if (stored) {
              return this.book.locations.load(stored);
            } else {
              return this.book.locations.generate(1600);
            }
          })
          .then(() => {
            this.rendition.attachTo(document.getElementById("reader"));
            this.rendition.display(this.info.lastCfi || 1);
            this.rendition.themes.registerRules("dark", dark);
            this.rendition.themes.registerRules("tan", tan);
            this.rendition.ready = true;
            this.theme = this.$store.getters.theme;
            this.applytheme(this.theme);
          })
          .then(() => {
            this.info.highlights.forEach((cfiRange) => {
              this.rendition.annotations.highlight(cfiRange);
            });
          })
          .then(() => {
            this.isReady = true;
            // 保存生成的位置
            localStorage.setItem(
              this.info.key + "-locations",
              this.book.locations.save()
            );
            this.loading.dismiss();
            window.rendition = this.rendition
            window.book = this.book
            // this.openToast()÷
          });
      })
    },
    async getInfo (id) {
      await localforage.getItem("books").then((bookArr) => {
        if (bookArr == null) {
          bookArr = [];
        }
        for (let i = 0; i < bookArr.length; i++) {
          if (bookArr[i].key === id) {
            this.info = bookArr[i];
            this.toc = this.info.toc;
            break;
          }
        }
        this.tocKey = true
      });
      this.info.lastOpen = new Date().getTime();
    },

    onNodeClick (item) {
      this.rendition.display(
        (item.toc && item.toc.href) || item.cfi || item.href
      );
      menuController.close('toc')
    },

    tocFromPercentage (percent) {
      if (!this._flattenedToc) return {};

      percent /= 100;

      for (let i = 0; i < this._flattenedToc.length; i += 1) {
        if (this._flattenedToc[i].percentage > percent) {
          return this._flattenedToc[i - 1];
        }
      }

      return null;
    },
    handleBookMark () {
      if (this.hasBookMark) {
        this.removeBookmark(this.currentLocaiont)
      } else {
        this.addBookmark()
      }
    },
    removeBookmark (bookmark) {
      // debugger
      const index = this.info.bookmarks.findIndex(
        (item) => item.cfi === bookmark.cfi
      );
      this.info.bookmarks.splice(index, 1);
      this.updateInfo();
      // this.$db.insert(this.info.id, this.info);
    },
    addBookmark () {
      const { location } = this.rendition;
      const { href, cfi, percentage } = location.start;
      const title = `${this.lableFromPercentage(percentage * 100)} : At ${Math.floor(this.progress * 1000) / 10}%`;

      const bookmark = {
        label: title,
        cfi,
        href,
      };

      this.info.bookmarks.push(bookmark);
      this.updateInfo();
    },

  }
});
</script>
<style scoped>
#reader {
  user-select: none;
  height: 100%;
}
ion-segment {
  border-radius: 0;
}
ion-icon {
  /* margin-top: 4px; */
  font-size: 24px;
  margin: 8px;
}
ion-footer {
  margin-bottom: var(--ion-safe-area-bottom);
}
</style>
<style>
.menu-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}
ion-menu {
  margin-top: var(--ion-safe-area-top);
  margin-bottom: var(--ion-safe-area-bottom);
}
</style>
