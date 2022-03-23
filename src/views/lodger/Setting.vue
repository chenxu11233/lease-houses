<template>
  <div>
    <div class="container">
      <div class="form-box">
        <el-form ref="form" :model="form" label-width="80px" :rules="rules">
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
          <el-form-item label="电话" prop="phone">
            <el-input v-model="form.phone"></el-input>
          </el-form-item>
          <el-form-item label="职业">
            <el-input v-model="form.profession"></el-input>
          </el-form-item>
          <el-form-item label="年收入">
            <el-input v-model="form.revenue"></el-input>
          </el-form-item>
          <el-form-item label="身份证" required prop="idCard">
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
    const checkIDCard = (rule, value, callback) => {
      const IDCardReg =
        /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[0-2])(([0-2][1-9])|10|20|30|31)\d{3}(\d|X|x)$/;
      // const sfzhReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
      if (value) {
        if (IDCardReg.test(value)) {
          callback();
        } else {
          callback(new Error("身份证号格式不正确"));
        }
      } else {
        callback(new Error("请输入身份证号"));
      }
    };
    // 设置手机号的验证规则
    const phone = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入联系方式"));
      } else {
        const reg = /^1[3|4|5|6|7|8|9]\d{9}$/;
        // const phoneReg = /^1[34578]\d{9}$/
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error("请输入正确的电话"));
        }
      }
    };
    return {
      form: {},
      rules: {
        idCard: { required: false, validator: checkIDCard, trigger: "blur" },
        phone: { required: false, validator: phone, trigger: "blur" },
      },
    };
  },
  mounted() {
    this.getUser();
  },
  methods: {
    getUser() {
      getUser().then((res) => {
        this.form = res.data;
        localStorage.setItem("userInfo", JSON.stringify(res.data));
        console.log("user", res);
      });
    },
    onSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          modifyUser(this.form).then((res) => {
            if (res.code === 200) {
              this.$message.success("修改成功！");
            }
            this.getUser();
          });
        }
      });
    },
  },
};
</script>
