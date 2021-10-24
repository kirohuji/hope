<template>
  <ion-list>
    <!-- <ion-list-header v-if="selectedType === 'downloaded'">
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
    </ion-item> -->
    <ion-list-header>
      <ion-label>List</ion-label>
    </ion-list-header>
    <ion-item-sliding
      v-for="(book,index) in list"
      :key="index"
    >
      <ion-item-options side="end">
        <ion-item-option
          color="danger"
          @click="deleteBook(book)"
        >
          删除
        </ion-item-option>
      </ion-item-options>
      <ion-item @click="handleBook(book)">
        <ion-thumbnail slot="start">
          <img
            style="height:100px"
            :src="book.cover"
          />
        </ion-thumbnail>
        <ion-label>
          <ion-badge
            v-if="!book.postsBooks"
            style="float:right"
            color="success"
          >已经下载</ion-badge>
          <h2>{{book.name}}</h2>
          <p>{{book.author || '无作者'}}</p>
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
    </ion-item-sliding>
  </ion-list>
</template>

<script>
import {
  IonList,
  IonListHeader,
  IonLabel,
  IonItem,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonThumbnail,
  IonProgressBar,
  IonBadge,
  IonChip,
  loadingController,
  toastController
} from '@ionic/vue';
import { service } from "./service";
import { useRouter } from "vue-router";
import axios from 'axios'
import SparkMD5 from "spark-md5";
import ePub from "epubjs";
import localforage from "localforage";
import BookModel from "./BookModel";
import BookUtils from "./BookUtils";
import { parshToc } from "@/utils/dbUtilis";
import _ from 'lodash'
export default {
  props: {
    selectedType: String,
    list: Array,
  },
  components: {
    IonList,
    IonListHeader,
    IonLabel,
    IonItem,
    IonThumbnail,
    IonProgressBar,
    IonBadge,
    IonChip,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
  },
  data () {
    return {
      loading: false,
      toast: false
    }
  },
  setup () {
    const router = useRouter();
    return {
      router
    }
  },
  methods: {
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
    handleUploadBook (book) {

      service.getBookFile(book.fileId).then((res) => {
        // debugger
        axios
          .request({
            url: res.data,
            method: "GET",
            responseType: "blob",
          })
          .then((response) => {
            const data = response.data;
            const blob = new File([data], book.name);
            this.getMd5WithBrowser(blob);
          });
      });
    },
    getMd5WithBrowser (file) {
      this.presentLoading('正在下载，请稍等')
      //   this.loading = true;
      return new Promise((resolve, reject) => {
        const blobSlice =
          File.prototype.slice ||
          File.prototype.mozSlice ||
          File.prototype.webkitSlice,
          chunkSize = 2097152, // 以每片2MB大小来逐次读取
          chunks = Math.ceil(file.size / chunkSize),
          spark = new SparkMD5(), //创建SparkMD5的实例
          fileReader = new FileReader();
        let currentChunk = 0;
        const loadNext = () => {
          const start = currentChunk * chunkSize,
            end =
              start + chunkSize >= file.size ? file.size : start + chunkSize;

          fileReader.readAsBinaryString(blobSlice.call(file, start, end));
        };

        fileReader.onload = async (e) => {
          if (!e.target) {
            reject();
            throw new Error();
          }
          spark.appendBinary(e.target.result); // append array buffer
          currentChunk += 1;
          if (currentChunk < chunks) {
            loadNext();
          } else {
            console.log("file", file);
            const md5 = spark.end(); // 完成计算，返回结果
            await this.handleToBook(file, md5);
            resolve();
          }
        };
        loadNext();
      });
    },
    handleToBook (file, md5) {
      return new Promise((resolve, reject) => {
        //md5重复不导入
        let isRepeat = false;
        localforage.getItem("books").then((bookArr) => {
          if (bookArr == null) {
            bookArr = [];
          }
          if (bookArr.length > 0) {
            bookArr.forEach((item) => {
              if (item.md5 === md5) {
                isRepeat = true;
                resolve();
              }
            });
          }

          //解析图书，获取图书数据
          if (!isRepeat) {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = async (e) => {
              if (!e.target) {
                reject();
                throw new Error();
              }
              let cover = "";
              // debugger;
              const epub = ePub(e.target.result, "binary");
              epub.loaded.metadata
                .then((metadata) => {
                  if (!e.target) {
                    reject();
                    throw new Error();
                  }
                  epub
                    .coverUrl()
                    .then(async (url) => {
                      const toc = await parshToc(epub);
                      if (url) {
                        const reader = new FileReader();
                        const blob = await fetch(url).then((r) => r.blob());
                        reader.readAsDataURL(blob);
                        reader.onloadend = async () => {
                          cover = reader.result;
                          const [name, author, description, publisher] = [
                            metadata.title,
                            metadata.creator,
                            metadata.description,
                            metadata.publisher,
                          ];
                          const format = "EPUB";
                          const key = new Date().getTime() + "";

                          const book = new BookModel(
                            key,
                            name,
                            author,
                            description,
                            md5,
                            cover,
                            format,
                            publisher,
                            toc
                          );
                          //   console.log("key");
                          this.handleAddBook(book);
                          BookUtils.addBook(key, e.target.result);
                          resolve();
                        };
                      } else {
                        cover = "noCover";
                        // let key, name, author, publisher, description;
                        const [name, author, description, publisher] = [
                          metadata.title,
                          metadata.creator,
                          metadata.description,
                          metadata.publisher,
                        ];
                        const format = "EPUB";
                        const key = new Date().getTime() + "";
                        const book = new BookModel(
                          key,
                          name,
                          author,
                          description,
                          md5,
                          cover,
                          format,
                          publisher,
                          toc
                        );
                        this.handleAddBook(book);
                        BookUtils.addBook(key, e.target.result);
                        resolve();
                      }
                    })
                    .catch((err) => {
                      console.log(err, "err");
                      reject();
                    });
                })
                .catch(() => {
                  console.log("Error occurs");
                  reject();
                });
            };
          }
        });
      });
    },
    handleAddBook (book) {
      return new Promise(() => {
        localforage.getItem("books").then((bookArr) => {
          if (bookArr == null) {
            bookArr = [];
          }
          bookArr.push(book);
          localforage.setItem("books", bookArr).then(() => {
            this.loading.dismiss();
            this.openToast()
            this.$emit('refresh')
          })
        });
      });
    },
    handleBook (book) {
      if (book.postsBooks) {
        this.handleUploadBook(book);
      } else {
        this.router.push({
          name: "Reader",
          params: { id: book.key, info: book },
        });
      }
    },
    deleteBook (book) {
      // this.presentLoading('正在删除，请稍等')
      localforage.getItem("books").then((bookArr) => {
        _.remove(bookArr, function (n) {
          return n.key === book.key
        })
        localforage.setItem("books", bookArr)
        localforage.removeItem(book.key).then(() => {
          this.$emit('refresh')
        })
        // this.loading.dismiss();

      });
    }
  }
}
</script>

<style scoped>
ion-thumbnail {
  height: 100px;
  width: 80px;
}
</style>