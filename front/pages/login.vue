<template>
  <div>
    <el-form class="login-form" rules="rules">
      <el-form-item props="email">
        <span>
          <i class="el-icon-mobile"></i>
        </span>
        <el-input placeholder="邮箱"></el-input>
      </el-form-item>
      <el-form-item props="password">
        <span>
          <i class="el-icon-lock"></i>
        </span>
        <el-input placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item props="password">
        <span>
          <i class="el-icon-captcha"></i>
        </span>
        <el-input placeholder="验证码"></el-input>
        <img :src="captcha" @click="UpdateCaptcha" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  layout: "login",
  data() {
    return {
      rules: [],
      captcha: `/api/captcha?_t=${new Date().getTime()}`
    };
  },
  methods: {
    UpdateCaptcha() {
      this.captcha = `/api/captcha?_t=${new Date().getTime()}`;
    }
  }
};
</script>

<style>
.login-form {
  width: 800px;
  margin: 50px auto;
}
</style>
