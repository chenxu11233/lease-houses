<template>
  <div>
    <div class="container">
      <el-table
        :data="tableData"
        border
        class="table"
        ref="multipleTable"
        header-cell-class-name="table-header"
        @selection-change="handleSelectionChange"
      >
        <el-table-column prop="name" label="地址">
          <template slot-scope="scope"
            >{{ scope.row.area }}{{ scope.row.address }}</template
          >
        </el-table-column>
        <el-table-column label="房租">
          <template slot-scope="scope">￥{{ scope.row.rentNum }}</template>
        </el-table-column>
        <el-table-column label="房屋照片(查看大图)" align="center">
          <template slot-scope="scope">
            <el-image
              class="table-td-thumb"
              :src="scope.row.housePicture"
              :preview-src-list="[scope.row.housePicture]"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column label="产权照片(查看大图)" align="center">
          <template slot-scope="scope">
            <el-image
              class="table-td-thumb"
              :src="scope.row.houseType"
              :preview-src-list="[scope.row.houseType]"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="rentalTime"
          label="出租时长(月)"
        ></el-table-column>
        <el-table-column prop="shareNum" label="出租类型">
          <template slot-scope="scope">{{
            scope.row.shareNum === 1 ? "整租" : "合租"
          }}</template>
        </el-table-column>
        <el-table-column prop="roomType" label="房型"></el-table-column>
        <el-table-column prop="owner.name" label="房东姓名"></el-table-column>
        <el-table-column
          prop="owner.idCard"
          label="房东身份证号"
        ></el-table-column>
        <el-table-column
          prop="owner.phone"
          label="房东联系方式"
        ></el-table-column>
        <el-table-column label="合同" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="linkContract(scope.row)"
              >查看</el-button
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-circle-check"
              @click="handleCheck(scope.$index, scope.row, '1')"
              >续租</el-button
            >
            <el-button
              type="text"
              icon="el-icon-circle-close"
              class="red"
              @click="handleCheck(scope.$index, scope.row, '0')"
              >退租</el-button
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
import { getCurrentRentHouse, leaseRenewalHouse } from "../../api/index";

export default {
  name: "basetable",
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
    handleCheck(index, row, type) {
      leaseRenewalHouse(row.houseId, row.rentNum, type).then((res) => {
        console.log("leaseRenewalHouse", res);
        this.getData();
      });
    },
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
      getCurrentRentHouse().then((res) => {
        this.tableData = res.data;
      });
    },
    // 触发搜索按钮
    handleSearch() {
      this.$set(this.query, "pageIndex", 1);
      this.getData();
    },
    // 删除操作
    handleDelete(index, row) {
      // 二次确认删除
      this.$confirm("确定要删除吗？", "提示", {
        type: "warning",
      })
        .then(() => {
          console.log("row", row);
          this.$message.success("删除成功");
          this.tableData.splice(index, 1);
        })
        .catch(() => {});
    },
    // 多选操作
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    delAllSelection() {
      const length = this.multipleSelection.length;
      let str = "";
      this.delList = this.delList.concat(this.multipleSelection);
      for (let i = 0; i < length; i++) {
        str += this.multipleSelection[i].name + " ";
      }
      this.$message.error(`删除了${str}`);
      this.multipleSelection = [];
    },
    addInfo() {
      this.form = {};
      this.editVisible = true;
    },
    //  address: "",
    //   landlordName: "",
    //   lodgerName: "",
    //   date: "",
    //   price: "",
    linkContract(row) {
      let d = new Date();
      d.setMonth(d.getMonth() + Number(row.rentalTime));
      let yy1 = d.getFullYear();
      let mm1 = d.getMonth() + 1; //因为getMonth（）返回值是 0（一月） 到 11（十二月） 之间的一个整数。所以要给其加1
      let dd1 = d.getDate();
      if (mm1 < 10) {
        mm1 = "0" + mm1;
      }
      if (dd1 < 10) {
        dd1 = "0" + dd1;
      }
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const data = {};
      data.address = row.area + row.address;
      data.landlordName = row.owner.name;
      data.landlordId = row.owner.idCard;
      data.lodgerName = userInfo.name;
      data.lodgerId = userInfo.idCard || "";
      data.date = yy1 + "-" + mm1 + "-" + dd1;
      data.price = row.rentNum;
      localStorage.setItem("cInfo", JSON.stringify(data));
      window.open("/#/contract");
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
