<template>
  <div>
    <div class="write-btn">
      <el-button type="primary" @clik="submit">提交</el-button>
    </div>
    <el-row>
      <el-col :span="12">
        <textarea
          class="md-editor"
          :value="content"
          @input="update"
          cols="30"
          rows="10"
        ></textarea>
      </el-col>
      <el-col :span="12">
        <div class="markdown-body" v-html="compiledContent"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import marked from "marked";
export default {
  mounted() {
    //写到data里会响应式处理，不显示的字段没必要。
    this.timer = null;
  },
  data() {
    return {
      content: `# 开课吧
      * 上课
      * 吃饭
      * 写代码`
    };
  },
  computed: {
    compiledContent() {
      return marked(this.content, {});
    }
  },
  methods: {
    submit() {},
    update(e) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.content = e.target.value;
      }, 350);
    }
  }
};
</script>

<style>
.md-editor {
  width: 100%;
  height: 100vh;
  outline: none;
}
.write-btn {
  position: fixed;
  z-index: 100;
  right: 30px;
  top: 10px;
}
</style>
