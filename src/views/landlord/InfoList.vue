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
      <div class="handle-box">
        <el-button
          type="warning"
          icon="el-icon-add-location
"
          @click="addInfo"
          >发布信息</el-button
        >
      </div>
      <el-table
        :data="tableData"
        border
        class="table"
        ref="multipleTable"
        header-cell-class-name="table-header"
      >
        <el-table-column prop="name" label="地址">
          <template slot-scope="scope"
            >{{ scope.row.area }}{{ scope.row.address }}</template
          >
        </el-table-column>
        <el-table-column label="房租">
          <template slot-scope="scope">￥{{ scope.row.rentNum }}</template>
        </el-table-column>
        <!-- <el-table-column label="房屋照片(查看大图)" align="center">
          <template slot-scope="scope">
            <el-image
              class="table-td-thumb"
              :src="scope.row.thumb"
              :preview-src-list="[scope.row.thumb]"
            ></el-image>
          </template>
        </el-table-column> -->
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
        <el-table-column prop="houseDesc" label="房屋介绍"></el-table-column>
        <!-- 房屋出租状态:0：待租；1：出租中；2：房屋待续租；3：房客发起房屋续租；4：房客发起租房申请；5：房东同意续租申请 -->
        <el-table-column label="状态" align="center" width="150px">
          <template slot-scope="scope">
            <el-tag>{{
              scope.row.houseAuditStatus === 0
                ? "未审核发布"
                : showStatus(scope.row.houseRentStatus)
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
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

    <!-- 编辑弹出框 -->
    <el-dialog title="出租房屋信息" :visible.sync="editVisible" width="70%">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="地址">
          <el-cascader
            v-model="form.areaCopy"
            :options="options"
            @change="handleChange"
          ></el-cascader>
          <el-input
            style="width: 200px; display: inline-block; margin-left: 10px"
            v-model="form.address"
          ></el-input>
        </el-form-item>
        <el-form-item label="房租">
          <el-input v-model="form.rentNum"></el-input>
        </el-form-item>
        <el-form-item label="出租时长(月)">
          <el-input v-model="form.rentalTime"></el-input>
        </el-form-item>
        <el-form-item label="出租类型">
          <el-radio-group v-model="form.shareNum">
            <el-radio :label="1">整租</el-radio>
            <el-radio :label="2">合租</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="房型">
          <el-input v-model="form.roomType"></el-input>
        </el-form-item>
        <el-form-item label="房屋介绍">
          <el-input v-model="form.houseDesc" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="房屋照片">
          <el-upload
            v-if="!form.housePicture"
            action="/api/house/picture"
            list-type="picture-card"
            :show-file-list="false"
            :on-success="handleAvatarSuccess1"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <div v-else>
            <img :src="form.housePicture" alt="" height="148" />
            <span @click="() => delImg(form, 'housePicture')">删除</span>
          </div>
        </el-form-item>
        <el-form-item label="产权照片">
          <el-upload
            v-if="!form.houseType"
            action="/api/house/picture"
            list-type="picture-card"
            :show-file-list="false"
            :on-success="handleAvatarSuccess2"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <div v-else>
            <img :src="form.houseType" alt="" height="148" />
            <span @click="() => delImg(form, 'houseType')">删除</span>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import areaList from "../../assets/js/json";
import {
  getHouse,
  modifyHouse,
  delHouse,
  upHouse,
  getUser,
} from "../../api/index";

export default {
  name: "basetable",
  data() {
    return {
      user: {},
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
    this.getUser();
    this.getData();
  },
  methods: {
    getUser() {
      getUser().then((res) => {
        this.user = res.data;
        localStorage.setItem("id", res.data.idCard);
      });
    },
    delImg(item, key) {
      this.$set(item, `${key}`, "");
    },
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
        case 6:
          return "房屋待退租";
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    getData() {
      getHouse({
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
    // 删除操作
    handleDelete(index, row) {
      // 二次确认删除
      this.$confirm("确定要删除吗？", "提示", {
        type: "warning",
      })
        .then(() => {
          delHouse(row.houseId).then((res) => {
            console.log("delHouse", res);
            this.getData();
            this.$message.success("删除成功");
          });
        })
        .catch(() => {});
    },
    addInfo() {
      if (!this.user.idCard) {
        this.$message.warning("请完善个人信息");
        return;
      }
      this.form = {};
      this.editVisible = true;
    },
    // 编辑操作
    handleEdit(index, row) {
      this.idx = index;
      this.form = row;
      console.log("this.form ", this.form);
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
          housePicture: this.imgUrl1,
          houseType: this.imgUrl2,
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
