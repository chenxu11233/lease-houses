<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="collapse"
      background-color="#324157"
      text-color="#bfcbd9"
      active-text-color="#20a0ff"
      unique-opened
      router
    >
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-submenu
                v-if="subItem.subs"
                :index="subItem.index"
                :key="subItem.index"
              >
                <template slot="title">{{ subItem.title }}</template>
                <el-menu-item
                  v-for="(threeItem, i) in subItem.subs"
                  :key="i"
                  :index="threeItem.index"
                  >{{ threeItem.title }}</el-menu-item
                >
              </el-submenu>
              <el-menu-item
                v-else
                :index="subItem.index"
                :key="subItem.index"
                >{{ subItem.title }}</el-menu-item
              >
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import bus from "../assets/js/bus";
export default {
  data() {
    return {
      collapse: false,
      items: [],
    };
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace("/", "");
    },
  },
  mounted() {
    this.items = [
      // landord
      {
        icon: "el-icon-user",
        index: "landlordSetting",
        title: "个人信息",
      },
      {
        icon: "el-icon-house",
        index: "infoList",
        title: "房屋管理",
      },
      {
        icon: "el-icon-set-up",
        title: "出租管理",
        index: 1,
        subs: [
          {
            icon: "el-icon-document-checked",
            index: "rentedList",
            title: "已租信息",
          },
          {
            icon: "el-icon-tickets",
            index: "rentingList",
            title: "待租信息",
          },
        ],
      },
      // lodger
      {
        icon: "el-icon-user",
        index: "lodgerSetting",
        title: "个人信息",
      },
      {
        icon: "el-icon-money",
        index: "lodgerRentingList",
        title: "查看房屋",
      },
      {
        icon: "el-icon-discount",
        title: "我的租房",
        index: 2,
        subs: [
          {
            icon: "el-icon-document-checked",
            index: "lodgerpenddingList",
            title: "待处理",
          },
          {
            icon: "el-icon-tickets",
            index: "lodgerRentedList",
            title: "已租房屋",
          },
        ],
      },
      // admin
      {
        icon: "el-icon-connection",
        title: "用户管理",
        index: 3,
        subs: [
          {
            icon: "el-icon-document-checked",
            index: "adminLandlordList",
            title: "租客列表",
          },
          {
            icon: "el-icon-tickets",
            index: "adminLodgerList",
            title: "房东列表",
          },
        ],
      },
      {
        icon: "el-icon-connection",
        title: "租房管理",
        index: 4,
        subs: [
          {
            icon: "el-icon-document-checked",
            index: "adminRoomCheck",
            title: "房源审核",
          },
          {
            icon: "el-icon-tickets",
            index: "adminLodgerCheck",
            title: "租房审核",
          },
          {
            icon: "el-icon-tickets",
            index: "adminContractList",
            title: "合同管理",
          },
        ],
      },
    ];
  },
  created() {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on("collapse", (msg) => {
      this.collapse = msg;
      bus.$emit("collapse-content", msg);
    });
  },
};
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 200px;
}
.sidebar > ul {
  height: 100%;
}
</style>
