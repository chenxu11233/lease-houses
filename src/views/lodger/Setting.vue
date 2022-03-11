<template>
  <div>
    <div class="container">
      <div class="form-box">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="昵称">
            <el-input v-model="form.nickname"></el-input>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-radio-group v-model="form.sex">
              <el-radio :label="0">男</el-radio>
              <el-radio :label="1">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="职业">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="年收入">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="form.phone"></el-input>
          </el-form-item>
          <el-form-item label="身份证" required>
            <el-input v-model="form.idCard"></el-input>
            <div style="color: red">需完善才能出租房屋</div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">修改</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { getUser, modifyUser } from "../../api/index";

export default {
  name: "Setting",
  data() {
    return {
      form: {},
    };
  },
  mounted() {
    this.getUser();
  },
  methods: {
    getUser() {
      getUser().then((res) => {
        this.form = res.data;
        localStorage.setItem("lid", res.data.idCard);
        console.log("user", res);
      });
    },
    onSubmit() {
      modifyUser(this.form).then((res) => {
        if (res.code === 200) {
          this.$message.success("修改成功！");
        }
        this.getUser();
      });
    },
  },
};
</script>
