<template>
  <div>
    <h1>用户中心</h1>
    <div ref="drag" id="drag">
      <input type="file" name="file" @change="handlerFileChange" />
    </div>
    <div>
      <el-progress
        :stroke-width="20"
        :text-inside="true"
        :percentage="uploadProgress"
      ></el-progress>
    </div>
    <div>
      <el-button @click="uploadFile">上传</el-button>
    </div>
  </div>
</template>

<script>
export default {
  async mounted() {
    const res = await this.$http.get("/user/info");
    console.log(res);
    this.bindEvent();
  },
  data() {
    return {
      file: null,
      uploadProgress: 0
    };
  },
  methods: {
    bindEvent() {
      const drag = this.$refs.drag;
      drag.addEventListener("dragover", e => {
        drag.style.borderColor = "red";
        e.preventDefault();
      });
      drag.addEventListener("dragleave", e => {
        drag.style.borderColor = "#eee";
        e.preventDefault();
      });
      drag.addEventListener("drop", e => {
        const fileList = e.dataTransfer.files;
        this.file = fileList[0];
        e.preventDefault();
      });
    },
    handlerFileChange(e) {
      const [file] = e.target.files;
      if (!file) return;
      this.file = file;
    },
    async uploadFile() {
      console.log("----");
      if (!(await this.isImage(this.file))) {
        console.log("格式不正确");
        return;
      }
      const form = new FormData();
      form.append("name", "file");
      form.append("file", this.file);
      const res = await this.$http.post("/uploadfile", form, {
        onUploadProgress: progress => {
          this.uploadProgress = Number(
            ((progress.loaded / progress.total) * 100).toFixed(2)
          );
        }
      });
      console.log(res);
    },
    async isImage(file) {
      return (
        (await this.isGif(file)) ||
        (await this.isJpg(file)) ||
        (await this.isPng(file))
      );
    },
    async isGif(file) {
      //前六位
      const ret = await this.blobToString(file.slice(0, 6));
      const isgif =
        ret.replace(/\s*/g, "") == "474946383961" ||
        ret.replace(/\s*/g, "") == "474946383761";
      return isgif;
    },
    async isPng(file) {
      //前八位
      const res = await this.blobToString(file.slice(0, 8));
      const ispng = res.replace(/\s*/g, "") === "89504E470D0A1A0A";
      return ispng;
    },
    async isJpg(file) {
      //前两位末两位
      const start = await this.blobToString(file.slice(0, 2));
      const tail = await this.blobToString(file.slice(-2, file.size));
      const isjpg =
        start.replace(/\s*/g, "") == "FFD8" &&
        tail.replace(/\s*/g, "") == "FFD9";
      return isjpg;
    },
    // async blobToString(blob) {
    //   return new Promise(resolve => {
    //     const reader = new FileReader();
    //     reader.onload = function() {
    //       console.log(reader.result);
    //       const res = reader.result
    //         .split(" ")
    //         .map(v => v.charCodeAt())
    //         .map(v => v.toString(16).toUpperCase())
    //         .join(" ");
    //       resolve(res);
    //     };
    //     reader.readAsBinaryString(blob);
    //   });
    // }
    async blobToString(blob) {
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = function() {
          console.log(reader.result);
          const ret = reader.result
            .split("")
            .map(v => v.charCodeAt())
            .map(v => v.toString(16).toUpperCase())
            // .map(v=>v.padStart(2,'0'))
            .join("");
          resolve(ret);
          // const ret = reader.
        };
        reader.readAsBinaryString(blob);
      });
    }
  }
};
</script>

<style>
#drag {
  height: 100px;
  line-height: 100px;
  text-align: center;
  border: 2px dashed #eee;
}
</style>
