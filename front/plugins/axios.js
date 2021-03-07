import Vue from "vue";
import axios from "axios";
import { MessageBox } from "element-ui";
//给每个this.$http请求地址加上/api
const service = axios.create({
  //timeout:5,
  baseURL: "/api"
});

const TOKEN_KEY = "token";

export default ({ store, redirect }) => {
  //请求拦截
  //token管理
  service.interceptors.request.use(
    config => {
      // 请求加token
      const token = window.localStorage.getItem(TOKEN_KEY);
      console.log(token);
      // 设置url白名单
      if (token) {
        config.headers.common["Authorization"] = "Bearer " + token;
      }
      return config;
    },
    err => {
      return Promise.reject(err);
    }
  );

  //相应拦截
  service.interceptors.response.use(async response => {
    let { data } = response;
    if (data.code == -666) {
      MessageBox.confirm("登录过期了", "登录", {
        confirmButtonText: "登录",
        showCancelButton: false,
        type: "warning"
      }).then(() => {
        localStorage.removeItem(TOKEN_KEY);
        redirect({ path: "login" });
      });
    }
    return data;
  });
};

// this.$http.post;
Vue.prototype.$http = service;
export const http = service;
