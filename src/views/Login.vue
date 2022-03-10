<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">城市房屋租赁平台</div>
      <el-form
        :model="param"
        :rules="rules"
        ref="login"
        label-width="0px"
        class="ms-content"
        v-if="!register"
      >
        <el-form-item prop="username">
          <el-input v-model="param.username" placeholder="username">
            <i slot="prefix" class="el-icon-user"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="password"
            v-model="param.password"
            @keyup.enter.native="submitForm()"
          >
            <i slot="prefix" class="el-icon-key"></i>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm()">登录</el-button>
          <el-button type="warning" @click="changeRegister()">注册</el-button>
        </div>
      </el-form>
      <el-form
        :model="param"
        :rules="rules"
        ref="register"
        label-width="0px"
        class="ms-content"
        v-else
      >
        <el-form-item prop="username">
          <el-input v-model="param.username" placeholder="username">
            <i slot="prefix" class="el-icon-user"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="password"
            v-model="param.password"
            @keyup.enter.native="submitForm()"
          >
            <i slot="prefix" class="el-icon-key"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="type">
          <el-select v-model="param.type" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <div class="login-btn">
          <el-button type="warning" @click="submitForm()">确定</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      param: {
        username: "admin",
        password: "123123",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
      register: false,
      options: [
        {
          label: "房客",
          value: 1,
        },
        {
          label: "房东",
          value: 2,
        },
      ],
      userInfo: {
        type: 2,
      },
    };
  },
  methods: {
    submitForm() {
      this.$refs.login.validate((valid) => {
        if (valid) {
          this.$message.success("登录成功");
          localStorage.setItem("ms_username", this.param.username);
          // 1 访客  2房东  0admin
          if (this.userInfo.type === 2) {
            this.$router.push("/infoList");
          } else if (this.userInfo.type === 1) {
            this.$router.push("/lodgerRentingList");
          } else {
            this.$router.push("/adminLandlordList");
          }
        } else {
          this.$message.error("请输入账号和密码");
          console.log("error submit!!");
          return false;
        }
      });
    },
    changeRegister() {
      this.register = !this.register;
    },
  },
};
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-size: 100%;
  background-image: url("../assets/img/login-bg.jpg");
}
.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  border-bottom: 1px solid #ddd;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}
.ms-content {
  padding: 30px 30px;
}
.ms-content i {
  font-size: 18px;
}
.ms-content .el-select {
  width: 100%;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
  margin-left: 0;
}
.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
</style>
