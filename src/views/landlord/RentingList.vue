<template>
  <div>
    <div class="container">
      <!-- <div class="handle-box">
        <el-input
          v-model="query.name"
          placeholder="用户名"
          class="handle-input mr10"
        ></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch"
          >搜索</el-button
        >
      </div> -->
      <el-table
        :data="tableData"
        border
        class="table"
        ref="multipleTable"
        header-cell-class-name="table-header"
        @selection-change="handleSelectionChange"
      >
        <el-table-column prop="name" label="租户姓名"></el-table-column>
        <el-table-column prop="idCard" label="身份证"></el-table-column>
        <el-table-column prop="profession" label="职业"></el-table-column>
        <el-table-column prop="phone" label="手机号码"></el-table-column>
        <el-table-column prop="sex" label="性别">
          <template slot-scope="scope">{{
            scope.row.sex == "0" ? "男" : "女"
          }}</template>
        </el-table-column>
        <el-table-column label="房屋地址">
          <template slot-scope="scope">{{ scope.row.address }}</template>
        </el-table-column>
        <!-- 房屋出租状态:0：待租；1：出租中；2：房屋待续租；3：房客发起房屋续租；4：房客发起租房申请；5：房东同意续租申请 -->
        <el-table-column label="状态" align="center" width="150px">
          <template slot-scope="scope">
            <el-tag>{{ showStatus(scope.row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-circle-check"
              @click="handleEdit(scope.$index, scope.row)"
              >同意</el-button
            >
            <el-button
              type="text"
              icon="el-icon-circle-close"
              class="red"
              @click="handleDelete(scope.$index, scope.row)"
              >拒绝</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import { getHouseRent, agreeHouseRent } from "../../api/index";

export default {
  data() {
    return {
      query: {
        address: "",
        name: "",
        pageIndex: 1,
        pageSize: 10,
      },
      tableData: [],
      multipleSelection: [],
      delList: [],
      editVisible: false,
      pageTotal: 0,
      form: {},
      idx: -1,
      id: -1,
      dialogImageUrl: "",
      dialogVisible: false,
    };
  },
  created() {
    this.getData();
  },
  methods: {
    showStatus(it) {
      switch (it) {
        case 0:
          return "待租";
        case 1:
          return "出租中";
        case 2:
          return "房屋待续租";
        case 3:
          return "房客发起房屋续租";
        case 4:
          return "房客发起租房申请";
        case 5:
          return "房东同意续租申请";
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 获取 easy-mock 的模拟数据
    getData() {
      getHouseRent().then((res) => {
        console.log("getHouseRent", res);
        this.tableData = res.data;
      });
    },
    // 触发搜索按钮
    handleSearch() {
      this.$set(this.query, "pageIndex", 1);
      this.getData();
    },
    // 删除操作
    // handleDelete(index, row) {
    //   // 二次确认删除
    //   this.$confirm("确定要删除吗？", "提示", {
    //     type: "warning",
    //   })
    //     .then(() => {
    //       console.log("row", row);
    //       this.$message.success("删除成功");
    //       this.tableData.splice(index, 1);
    //     })
    //     .catch(() => {});
    // },
    // 编辑操作
    handleEdit(index, row) {
      agreeHouseRent({
        houseId: row.houseId,
        userId: row.userId,
      }).then((res) => {
        console.log("agreeHouseRent", res);
        this.getData();
      });
    },
  },
};
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #ff0000;
}
.mr10 {
  margin-right: 10px;
}
.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}
</style>
