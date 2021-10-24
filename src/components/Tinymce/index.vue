<template>
  <div
    :class="{ fullscreen: fullscreen }"
    class="tinymce-container"
    :style="{ width: containerWidth, height: '100%' }"
  >
    <textarea
      :id="tinymceId"
      class="tinymce-textarea"
    />
    <!-- <div class="editor-custom-btn-container">
      <editorImage color="#1890ff" class="editor-upload-btn" @successCBK="imageSuccessCBK" />
    </div> -->
  </div>
</template>

<script>
/* eslint-disable */
/**
 * docs:
 * https://panjiachen.github.io/vue-element-admin-site/feature/component/rich-editor.html#tinymce
 */
// import editorImage from './components/EditorImage'
import plugins from "./plugins";
import toolbar from "./toolbar";
import load from "./dynamicLoadScript";

// why use this cdn, detail see https://github.com/PanJiaChen/tinymce-all-in-one
const tinymceCDN = "/tinymce/tinymce.min.js";
// import { service } from './service'
export default {
  name: "Tinymce",
  // components: { editorImage },
  props: {
    id: {
      type: String,
      default: function () {
        return (
          "vue-tinymce-" +
          +new Date() +
          ((Math.random() * 1000).toFixed(0) + "")
        );
      },
    },
    value: {
      type: String,
      default: "",
    },
    toolbar: {
      type: Array,
      required: false,
      default () {
        return [];
      },
    },
    menubar: {
      type: String,
      default: "file edit insert view format table",
    },
    height: {
      type: [Number, String],
      required: false,
      default: 360,
    },
    width: {
      type: [Number, String],
      required: false,
      default: "auto",
    },
  },
  data () {
    return {
      hasChange: false,
      hasInit: false,
      tinymceId: this.id,
      fullscreen: false,
      languageTypeList: {
        en: "en",
        zh: "zh_CN",
        es: "es_MX",
        ja: "ja",
      },
    };
  },
  computed: {
    containerWidth () {
      const width = this.width;
      if (/^[\d]+(\.[\d]+)?$/.test(width)) {
        // matches `100`, `'100'`
        return `${width}px`;
      }
      return width;
    },
  },
  watch: {
    value (val) {
      if (!this.hasChange && this.hasInit) {
        this.$nextTick(() =>
          window.tinymce.get(this.tinymceId).setContent(val || "")
        );
      }
    },
  },
  mounted () {
    this.init();
  },
  activated () {
    if (window.tinymce) {
      this.initTinymce();
    }
  },
  deactivated () {
    this.destroyTinymce();
  },
  unmounted () {
    this.destroyTinymce();
  },
  methods: {
    init () {
      // dynamic load tinymce from cdn
      load(tinymceCDN, (err) => {
        if (err) {
          this.$message.error(err.message);
          return;
        }
        this.initTinymce();
      });
    },
    urlToBase64 (url) {
      return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = function () {
          const canvas = document.createElement("canvas");
          canvas.width = this.naturalWidth;
          canvas.height = this.naturalHeight;
          // 将图片插入画布并开始绘制
          canvas.getContext("2d").drawImage(image, 0, 0);
          // result
          const result = canvas.toDataURL("image/png");
          resolve(result);
        };
        // CORS 策略，会存在跨域问题https://stackoverflow.com/questions/20424279/canvas-todataurl-securityerror
        image.setAttribute("crossOrigin", "Anonymous");
        image.src = url;
        // 图片加载失败的错误处理
        image.onerror = () => {
          reject(new Error("转换失败"));
        };
      });
    },
    initTinymce () {
      const _this = this;
      window.tinymce.init({
        selector: `#${this.tinymceId}`,
        language: this.languageTypeList["zh"],
        auto_focus: true,
        code_dialog_height: 450,
        code_dialog_width: 1000,
        height: this.height,
        branding: false, //（隐藏右下角技术支持）
        elementpath: false, //（隐藏底栏的元素路径）
        body_class: "panel-body ",
        object_resizing: false,
        toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
        menubar: this.menubar,
        plugins: plugins,
        mobile: {
          // toolbar_mode: "scrolling",
          // toolbar_location: "bottom",
          toolbar_persist: true,
          toolbar_sticky: true,
          menubar: this.menubar,
          // toolbar_drawer: true,
        },
        placeholder: "请输入内容",
        end_container_on_empty_block: true,
        powerpaste_word_import: "clean",
        paste_data_images: true,
        images_file_types: "jpeg,jpg,png,gif,bmp,webp",
        advlist_bullet_styles: "square",
        advlist_number_styles: "default",
        default_link_target: "_blank",
        link_title: false,
        save: true,
        nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
        init_instance_callback: (editor) => {
          if (_this.value) {
            editor.setContent(_this.value);
          }
          _this.hasInit = true;
          editor.on("NodeChange Change KeyUp SetContent", () => {
            this.hasChange = true;
            this.$emit("input", editor.getContent());
          });
          editor.on('blur', () => {
            window.scrollTo(0, 1);
            // if (!window.tinyClose) {
            //   // this.$nextTick(() => {
            //   editor.focus()
            //   // })
            // } else {
            //   this.$nextTick(() => {
            //     editor.blur()
            //   })
            // }
          })
        },
        convert_urls: true,
      });
    },
    destroyTinymce () {
      const tinymce = window.tinymce.get(this.tinymceId);
      if (this.fullscreen) {
        tinymce.execCommand("mceFullScreen");
      }

      if (tinymce) {
        tinymce.destroy();
      }
    },
    setContent (value) {
      window.tinymce.get(this.tinymceId).setContent(value);
    },
    getContent () {
      window.tinymce.get(this.tinymceId).getContent();
    },
    imageSuccessCBK (arr) {
      arr.forEach((v) =>
        window.tinymce
          .get(this.tinymceId)
          .insertContent(`<img class="wscnph" src="${v.url}" >`)
      );
    },
  },
};
</script>

<style lang="scss">
.tinymce-container {
  position: relative;
  line-height: normal;
}

.tinymce-container {
  .mce-fullscreen {
    z-index: 10000;
  }
  .mce-panel {
    border: none;
  }
  .mce-btn-group * {
    display: flex;
    flex-wrap: wrap;
  }
}

.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}

.editor-custom-btn-container {
  position: absolute;
  right: 4px;
  top: 4px;
  /*z-index: 2005;*/
}

.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}

.editor-upload-btn {
  display: inline-block;
}
.tox-editor-header {
  position: fixed !important;
  bottom: 0;
  border: 1px solid #ccc !important;
}
.tox .tox-toolbar__group {
  flex-wrap: wrap !important;
}
.el-drawer__header {
  margin-bottom: 0px;
}
</style>
