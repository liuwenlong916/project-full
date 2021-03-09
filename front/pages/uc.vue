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
      <p>计算hash的进度</p>
      <el-progress
        :stroke-width="20"
        :text-inside="true"
        :percentage="hashProgress"
      ></el-progress>
    </div>
    <div>
      <div class="cube-container" :style="{ width: cubeWidth + 'px' }">
        <div class="cube" v-for="chunk in chunks" :key="chunk.name">
          <div
            :class="{
              uploading: chunk.progress > 0 && chunk.progress < 100,
              success: chunk.progress == 100,
              error: chunk.progress < 0
            }"
          >
            <i
              class="el-icon-loading"
              style="color:$f56c6c"
              v-if="chunk.progress < 100 && chunk.progress > 0"
            ></i>
          </div>
        </div>
      </div>
    </div>
    <div>
      <el-button @click="uploadFile">上传</el-button>
    </div>
  </div>
</template>

<script>
import sparkMD5 from "spark-md5";
const CHUNK_SIZE = 0.5 * 1024 * 1024; //0.5兆
export default {
  async mounted() {
    const res = await this.$http.get("/user/info");
    console.log(res);
    this.bindEvent();
  },
  data() {
    return {
      file: null,
      // uploadProgress: 0,
      chunks: [],
      hashProgress: 0
    };
  },
  computed: {
    cubeWidth() {
      //平方根向上取整
      return Math.ceil(Math.sqrt(this.chunks.length)) * 16;
    },
    uploadProgress() {
      if (!this.file || this.chunks.length) {
        return 0;
      }
      const loaded = this.chunks
        .map(item => item.chunk.size * item.progress)
        .reduce(acc, cur => acc + cur, 0);
      return parseInt(((loaded / this.file.size) * 100).toFixed(2));
    }
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
    createFileChunk(file, size = CHUNK_SIZE) {
      const chunks = [];
      let cur = 0;
      while (cur < file.size) {
        chunks.push({ index: cur, file: file.slice(cur, cur + size) });
        cur += size;
      }
      return chunks;
    },
    async calculateHashWorker() {
      return new Promise(resolve => {
        //开启一个新进程
        this.worker = new Worker("/hash.js");
        this.worker.postMessage({ chunks: this.chunks }); //传入
        this.worker.onmessage = e => {
          const { progress, hash } = e.data;
          this.hashProgress = Number(progress.toFixed(2));
          if (hash) {
            resolve(hash);
          }
        };
      });
    },
    async calculateHashIdle() {
      const chunks = this.chunks;
      return new Promise(resolve => {
        const spark = new sparkMD5.ArrayBuffer();
        let count = 0;
        const appendToSpark = async file => {
          new Promise(resolve => {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = e => {};
          });
        };

        const workloop = async deadline => {
          while (count < chunks.length && deadline.timeRemaining() > 1) {
            //空闲时间，且有任务
            await appendToSpark(chunks[count].file);
            count++;
            if (count === chunks.length) {
              this.hashProgress = 100;
              resolve(spark.end());
            } else {
              this.hashProgress = Number((count / chunks.length) * 100);
            }
          }
          window.requestIdleCallback(workloop);
        };
        window.requestIdleCallback(workloop);
      });
    },
    async calculateHashSample() {
      //布隆过滤器
      return new Promise(resolve => {
        const spark = new sparkMD5.ArrayBuffer();
        const reader = new FileReader();
        const file = this.file;
        const size = file.size;
        const offset = 2 * 1024 * 1024;
        //首尾2M，中间去前中后各两个字节
        let chunks = [file.slice(0, offset)];
        let cur = offset;
        while (cur < size) {
          if (cur + offset > size) {
            //到末尾取最后2M
            chunks.push(file.slice(size - offset, size));
          } else {
            let midd = cur + offset / 2;
            let end = cur + offset;
            chunks.push(file.slice(cur, cur + 2));
            chunks.push(file.slice(midd, midd + 2));
            chunks.push(file.slice(end - 2, end));
          }
          cur += offset;
        }

        reader.readAsArrayBuffer(new Blob(chunks));
        reader.onload = e => {
          spark.append(e.target.result);
          this.hashProgress = 100;
          resolve(spark.end());
        };
      });
    },

    async uploadFile() {
      console.log("----");
      // if (!(await this.isImage(this.file))) {
      //   console.log("格式不正确");
      //   return;
      // }
      //根据size生成文件切片
      const chunks = this.createFileChunk(this.file);
      // const hash = await this.calculateHashWorker();
      // console.log(hash);
      // const hash1 = await this.calculateHashIdle();
      // console.log(hash1);
      const hash = await this.calculateHashSample();
      this.chunks = chunks.map((chunk, index) => {
        const name = hash + "-" + index;
        return {
          hash,
          name,
          index,
          chunk: chunk.file
        };
      });
      await this.uploadChunks();
      // const form = new FormData();
      // form.append("name", "file");
      // form.append("file", this.file);
      // const res = await this.$http.post("/uploadfile", form, {
      //   onUploadProgress: progress => {
      //     this.uploadProgress = Number(
      //       ((progress.loaded / progress.total) * 100).toFixed(2)
      //     );
      //   }
      // });
      // console.log(res);
    },
    async uploadChunks() {
      const requests = this.chunks
        .map((chunk, index) => {
          const form = new FormData();
          form.append("hash", chunck.hash);
          form.append("name", chunck.name);
          form.append("index", chunck.index);
          form.append("chunk", chunck.chunk);
          return from;
        })
        .map((form, index) => {
          this.$http.poost("/uploadfile", form, {
            onUploadProgress: progress => {
              this.chunks[index].progress = Numberr(
                ((progress.loaded / progress.total) * 100).toFixed(2)
              );
            }
          });
        });
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

.cube {
  width: 14px;
  height: 14px;
  line-height: 12px;
  border: 1px black solid;
  background: #eee;
  float: left;
}
.success {
  background: green;
}
.uploading {
  background: blue;
}
.error {
  background: red;
}
</style>
