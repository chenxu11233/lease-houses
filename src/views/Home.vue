<template>
  <div class="home">
    <Header></Header>
    <VSideBar></VSideBar>
    <div class="content-box" :class="{ 'content-collapse': collapse }">
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
    <el-dialog title="修改密码" :visible.sync="dialogVisible" width="500px">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="修改密码" required>
          <el-input type="password" v-model="form.p1"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" required>
          <el-input type="password" v-model="form.p2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="modifyPass">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// @ is an alias to /src
import Header from "@/components/Header.vue";
import VSideBar from "@/components/VSideBar.vue";
import bus from "../assets/js/bus";
import { modifyUser, getUser } from "../api/index";

export default {
  name: "Home",
  data() {
    return {
      collapse: false,
      dialogVisible: false,
      form: {
        p1: "",
        p2: "",
      },
      user: {},
    };
  },
  components: {
    Header,
    VSideBar,
  },
  created() {
    this.getUser();
    bus.$on("collapse-content", (msg) => {
      this.collapse = msg;
    });
    bus.$on("show-modify-password", (msg) => {
      this.dialogVisible = msg;
    });
  },
  methods: {
    getUser() {
      getUser().then((res) => {
        this.user = res.data;
      });
    },
    onSubmit() {
      modifyUser(this.user).then((res) => {
        if (res.code === 200) {
          this.$message.success("修改成功！");
        }
        this.dialogVisible = false;
        this.getUser();
      });
    },
    modifyPass() {
      if (!this.form.p1 || !this.form.p2) {
        this.$message.error("请输入修改的密码", 2);
        return;
      }
      if (this.form.p1 !== this.form.p2) {
        this.$message.error("请输入相同密码", 2);
        return;
      }
      this.user.password = this.form.p1;
      this.onSubmit();
    },
  },
};
</script>
