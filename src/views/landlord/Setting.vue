<template>
  <div>
    <div class="container">
      <div class="form-box">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="昵称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="住址">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="身份证" required>
            <el-input v-model="form.name"></el-input>
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
export default {
  name: "baseform",
  data() {
    return {
      options: [
        {
          value: "guangdong",
          label: "广东省",
          children: [
            {
              value: "guangzhou",
              label: "广州市",
              children: [
                {
                  value: "tianhe",
                  label: "天河区",
                },
                {
                  value: "haizhu",
                  label: "海珠区",
                },
              ],
            },
            {
              value: "dongguan",
              label: "东莞市",
              children: [
                {
                  value: "changan",
                  label: "长安镇",
                },
                {
                  value: "humen",
                  label: "虎门镇",
                },
              ],
            },
          ],
        },
        {
          value: "hunan",
          label: "湖南省",
          children: [
            {
              value: "changsha",
              label: "长沙市",
              children: [
                {
                  value: "yuelu",
                  label: "岳麓区",
                },
              ],
            },
          ],
        },
      ],
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: true,
        type: ["步步高"],
        resource: "小天才",
        desc: "",
        options: [],
      },
    };
  },
  methods: {
    onSubmit() {
      this.$message.success("提交成功！");
    },
  },
};
</script>
