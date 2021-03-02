import Vue from "vue";
import axios from "axios";

const service = axios.create({
  //timeout:5,
  baseURL: "/api"
});

//请求拦截
//token管理

//相应拦截

// this.$http.post;
Vue.prototype.$http = service;
export const http = service;
