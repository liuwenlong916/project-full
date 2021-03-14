<template>
  <div>
    <div class="write-btn">
      <el-button type="primary" @clik="submit">提交</el-button>
    </div>
    <el-row>
      <el-col :span="12">
        <textarea
          ref="editor"
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
//富文本编辑器
// <div contenteditable="true">哈哈</div>
// document.execCommand('')
// 1. 刚开始第三方的
//   tinyMce，wangEditor
// 2. 开源的定制  slate.js
// 3. 又专门的编辑器开发团队，自己定制把，非常复杂，word在线版
//   计算位置，定位，样式，实现一个简单的浏览器工作量差不多的
import marked from "marked";
import hljs from "highlight.js";
import javascript from "highlight.js/lib/languages/javascript";
import "highlight.js/styles/monokai-sublime.css";
export default {
  mounted() {
    //写到data里会响应式处理，不显示的字段没必要。
    this.timer = null;
    this.bindEvents();
    marked.setOptions({
      rendered: new marked.Renderer(),
      highlight(code) {
        return hljs.highlightAuto(code).value;
      }
    });
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
    bindEvents() {
      this.$refs.editor.addEventListener("paste", async e => {
        const files = e.clipboardData.files;
        console.log(files);
      });
      this.$refs.editor.addEventListener("drop", e => {
        e.preventDefault(); //阻止原事件
        const files = e.dataTransfer.files;
        //TODO文件上传
        console.log(files);
      });
    },
    async submit() {
      //文章列表,点赞，关注，草稿
      //user->article一对多
      let ret = await this.$http.post("/article/create", {
        content: this.content, //mongoose设置selectd:false;默认不显示
        compiledContent: this.compiledContent
      });
    },
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
