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
        <el-select
          v-model="query.address"
          placeholder="地址"
          class="handle-select mr10"
        >
          <el-option key="1" label="广东省" value="广东省"></el-option>
          <el-option key="2" label="湖南省" value="湖南省"></el-option>
        </el-select>
        <el-input
          v-model="query.name"
          placeholder="用户名"
          class="handle-input mr10"
        ></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch"
          >搜索</el-button
        >
        <el-button
          type="warning"
          style="float: right"
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
        <el-table-column
          prop="id"
          label="ID"
          width="55"
          align="center"
        ></el-table-column>
        <el-table-column prop="name" label="用户名"></el-table-column>
        <el-table-column label="账户余额">
          <template slot-scope="scope">￥{{ scope.row.money }}</template>
        </el-table-column>
        <el-table-column label="头像(查看大图)" align="center">
          <template slot-scope="scope">
            <el-image
              class="table-td-thumb"
              :src="scope.row.thumb"
              :preview-src-list="[scope.row.thumb]"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-tag
              :type="
                scope.row.state === '成功'
                  ? 'success'
                  : scope.row.state === '失败'
                  ? 'danger'
                  : ''
              "
              >{{ scope.row.state }}</el-tag
            >
          </template>
        </el-table-column>

        <el-table-column prop="date" label="注册时间"></el-table-column>
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
    <el-dialog title="出租房屋信息" :visible.sync="editVisible" width="50%">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="地址">
          <el-cascader
            v-model="form.area"
            :options="options"
            @change="handleChange"
          ></el-cascader>
          <el-input
            style="width: 200px; display: inline-block; margin-left: 10px"
            v-model="form.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="房租">
          <el-input v-model="form.address"></el-input>
        </el-form-item>
        <el-form-item label="出租时长(月)">
          <el-input v-model="form.address"></el-input>
        </el-form-item>
        <el-form-item label="出租类型">
          <el-radio-group v-model="form.resource">
            <el-radio label="合租"></el-radio>
            <el-radio label="单租"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="房型">
          <el-input v-model="form.address"></el-input>
        </el-form-item>
        <el-form-item label="房屋介绍">
          <el-input v-model="form.address" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="房屋照片">
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="产权照片">
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
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
      options: areaList,
    };
  },
  created() {
    this.getData();
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 获取 easy-mock 的模拟数据
    getData() {
      (this.tableData = [
        {
          id: 1,
          name: "张三",
          money: 123,
          address: "广东省东莞市长安镇",
          state: "成功",
          date: "2019-11-1",
          thumb: "https://lin-xin.gitee.io/images/post/wms.png",
        },
        {
          id: 2,
          name: "李四",
          money: 456,
          address: "广东省广州市白云区",
          state: "成功",
          date: "2019-10-11",
          thumb: "https://lin-xin.gitee.io/images/post/node3.png",
        },
        {
          id: 3,
          name: "王五",
          money: 789,
          address: "湖南省长沙市",
          state: "失败",
          date: "2019-11-11",
          thumb: "https://lin-xin.gitee.io/images/post/parcel.png",
        },
        {
          id: 4,
          name: "赵六",
          money: 1011,
          address: "福建省厦门市鼓浪屿",
          state: "成功",
          date: "2019-10-20",
          thumb: "https://lin-xin.gitee.io/images/post/notice.png",
        },
      ]),
        (this.pageTotal = 4);
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
    addInfo() {
      this.form = {};
      this.editVisible = true;
    },
    // 编辑操作
    handleEdit(index, row) {
      this.idx = index;
      this.form = row;
      this.editVisible = true;
    },
    // 保存编辑
    saveEdit() {
      this.editVisible = false;
      this.$message.success(`修改第 ${this.idx + 1} 行成功`);
      this.$set(this.tableData, this.idx, this.form);
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
