<template>
  <div>
    <h1>用户中心</h1>
    <div>
      <input type="file" name="file" @change="handlerFileChange" />
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
  },
  data() {
    return {
      file: null
    };
  },
  methods: {
    handlerFileChange(e) {
      const [file] = e.target.files;
      if (!file) return;
      this.file = file;
    },
    async uploadFile() {
      const form = new FormData();
      form.append("name", "file");
      form.append("file", this.file);
      const res = await this.$http.post("/uploadfile", form);
      console.log(res);
    }
  }
};
</script>

<style></style>
