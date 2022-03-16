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
        <el-form ref="form" :model="query" :inline="true">
          <el-form-item label="地区">
            <el-cascader
              placeholder="地区"
              class="handle-select mr10"
              v-model="query.area"
              :options="options"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="是否合租">
            <el-select v-model="query.share">
              <el-option label="是" :value="true"></el-option>
              <el-option label="否" :value="false"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="价格区间">
            <el-col :span="11">
              <el-input
                v-model="query.rentMinNum"
                placeholder="最小"
              ></el-input>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-input
                v-model="query.rentMaxNum"
                placeholder="最大"
              ></el-input>
            </el-col>
          </el-form-item>
        </el-form>
        <div class="searchWrap">
          <el-button type="primary" icon="el-icon-search" @click="handleSearch"
            >搜索</el-button
          >
        </div>
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
        <el-table-column label="图片" align="center">
          <template slot-scope="scope">
            <el-image
              :src="scope.row.housePicture"
              :preview-src-list="[scope.row.housePicture]"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="houseDesc" label="房屋介绍"></el-table-column>
        <!-- 房屋出租状态:0：待租；1：出租中；2：房屋待续租；3：房客发起房屋续租；4：房客发起租房申请；5：房东同意续租申请 -->
        <!-- <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-tag>{{ showStatus(scope.row.houseRentStatus) }}</el-tag>
          </template>
        </el-table-column> -->
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="applyH(scope.$index, scope.row)"
              >申请</el-button
            >
            <el-button type="text" @click="handleEdit(scope.$index, scope.row)"
              >查看详情</el-button
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
    <el-dialog
      title="出租房屋信息"
      class="dialog-none"
      :visible.sync="editVisible"
      width="70%"
    >
      <el-form ref="form" :model="form" label-width="120px" :disabled="true">
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
            <el-radio label="1">整租</el-radio>
            <el-radio label="2">合租</el-radio>
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
            action="http://rap2api.taobao.org/app/mock/299165/house/picture"
            list-type="picture-card"
            :show-file-list="false"
            :on-success="handleAvatarSuccess1"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-image
            v-else
            height="148"
            class="table-td-thumb"
            :src="form.housePicture"
            :preview-src-list="[form.housePicture]"
          ></el-image>
        </el-form-item>
        <el-form-item label="产权照片">
          <el-upload
            v-if="!form.houseType"
            action="http://rap2api.taobao.org/app/mock/299165/house/picture"
            list-type="picture-card"
            :show-file-list="false"
            :on-success="handleAvatarSuccess2"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-image
            v-else
            height="148"
            class="table-td-thumb"
            :src="form.houseType"
            :preview-src-list="[form.houseType]"
          ></el-image>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import areaList from "../../assets/js/json";
import { getHouse, delHouse, requestHouse } from "../../api/index";

export default {
  name: "basetable",
  data() {
    return {
      query: {
        rentMaxNum: "",
        rentMinNum: "",
        area: "",
        share: "",
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
    getData() {
      getHouse({
        page: this.query.pageIndex,
        size: this.query.pageSize,
        area: this.query.area,
        share: this.query.share,
        rentMinNum: this.query.rentMinNum,
        rentMaxNum: this.query.rentMaxNum,
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
      this.form = {};
      this.editVisible = true;
    },
    // 申请
    applyH(index, row) {
      requestHouse({
        houseId: row.houseId,
        rentDuration: row.rentalTime,
      }).then(() => {
        this.getData();
        this.$message.success("申请成功");
      });
    },
    // 编辑操作
    handleEdit(index, row) {
      this.idx = index;
      this.form = row;
      this.form.areaCopy = row.area.split(",");
      this.editVisible = true;
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
  flex-direction: row;
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
  height: 148px;
}
</style>
