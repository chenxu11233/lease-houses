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
        <el-table-column prop="owner.name" label="房东姓名"></el-table-column>
        <el-table-column
          prop="owner.phone"
          label="房东联系方式"
        ></el-table-column>
        <el-table-column label="状态" align="center" width="180">
          <template slot-scope="scope">
            <el-tag>{{ showStatus(scope.row.status) }}</el-tag>
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
import { getTenantAuditInfo } from "../../api/index";

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
    showStatus(it) {
      switch (it) {
        case 3:
          return "续租申请中";
        case 4:
          return "租房申请中";
        case 6:
          return "退租申请中";
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
      getTenantAuditInfo().then((res) => {
        console.log("resres", res);
        let data3 = (res.data["3"] || []).map((item) => {
          return {
            ...item,
            status: 3,
          };
        });
        let data4 = (res.data["4"] || []).map((item) => {
          return {
            ...item,
            status: 4,
          };
        });
        let data6 = (res.data["6"] || []).map((item) => {
          return {
            ...item,
            status: 6,
          };
        });
        this.tableData = data4.concat(data3).concat(data6);
        console.log("tableData", this.tableData);
      });
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
      data.landlordName = row.landlord.name;
      data.landlordId = row.landlord.idCard;
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
