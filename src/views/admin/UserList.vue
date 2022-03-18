<template>
  <div>
    <!-- <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div> -->
    <div class="container">
      <el-table
        :data="tableData"
        border
        class="table"
        ref="multipleTable"
        header-cell-class-name="table-header"
      >
        <el-table-column prop="userId" label="用户ID"></el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="nickname" label="用户名"></el-table-column>
        <el-table-column prop="profession" label="职业"></el-table-column>
        <el-table-column prop="revenue" label="年收入"></el-table-column>
        <el-table-column prop="phone" label="电话"></el-table-column>
        <el-table-column prop="idCard" label="身份证"></el-table-column>
        <el-table-column prop="shareNum" label="性别">
          <template slot-scope="scope">{{
            scope.row.shareNum === 1 ? "男" : "女"
          }}</template>
        </el-table-column>
        <el-table-column prop="shareNum" label="用户类型">
          <template slot-scope="scope">{{
            scope.row.shareNum === 0 ? "房客" : "房东"
          }}</template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :current-page="query.pageIndex"
          :page-size="query.pageSize"
          :total="pageTotal"
          @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import areaList from "../../assets/js/json";
import { getUserList, modifyHouse, auditHouse, upHouse } from "../../api/index";

export default {
  name: "basetable",
  data() {
    return {
      query: {
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
      options: areaList,
      imgUrl1: "",
      imgUrl2: "",
    };
  },
  created() {
    this.getData();
  },
  methods: {
    handleAvatarSuccess1(res, file) {
      console.log("handleAvatarSuccess,", res);
      this.$set(this.form, "housePicture", URL.createObjectURL(file.raw));
      this.imgUrl1 = res.data;
    },
    handleAvatarSuccess2(res, file) {
      this.$set(this.form, "houseType", URL.createObjectURL(file.raw));
      this.imgUrl2 = res.data;
    },
    handleChange(v) {
      console.log(v);
    },
    //       <!-- 房屋出租状态:0：待租；1：出租中；2：房屋待续租；3：房客发起房屋续租；4：房客发起租房申请；5：房东同意续租申请 -->
    showStatus(it) {
      switch (it) {
        case 0:
          return "未审核";
        case 1:
          return "审核通过";
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    getData() {
      getUserList({
        page: this.query.pageIndex,
        size: this.query.pageSize,
      }).then((res) => {
        this.pageTotal = res.data.total;
        this.tableData = res.data.list;
      });
    },
    // 触发搜索按钮
    handleSearch() {
      this.$set(this.query, "pageIndex", 1);
      this.getData();
    },
    handlePass(index, row) {
      auditHouse({
        houseId: row.houseId,
        pass: true,
      }).then(() => {
        this.getData();
        this.$message.success("审核成功");
      });
    },
    addInfo() {
      this.form = {};
      this.editVisible = true;
    },
    // 编辑操作
    handleEdit(index, row) {
      this.idx = index;
      this.form = row;
      this.form.areaCopy = row.area.split(",");
      this.editVisible = true;
    },
    // 保存编辑
    saveEdit() {
      if (this.form.houseId) {
        this.editVisible = false;
        modifyHouse(this.form.houseId, {
          ...this.form,
          area: this.form.areaCopy.join(","),
        }).then((res) => {
          this.form = {};
          this.getData();
          console.log("resp---", res);
        });
        this.$message.success(`修改成功`);
      } else {
        upHouse({
          ...this.form,
          area: this.form.areaCopy.join(","),
          housePicture: this.imgUrl1,
          houseType: this.imgUrl2,
        }).then(() => {
          this.editVisible = false;
          this.form = {};
          this.getData();
        });
        this.$message.success(`新增成功`);
      }
    },
    // 分页导航
    handlePageChange(val) {
      this.$set(this.query, "pageIndex", val);
      this.getData();
    },
  },
};
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
  display: flex;
  flex-direction: row-reverse;
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
