import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/infoList",
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/",
    component: () => import("../views/Home.vue"),
    meta: { title: "" },
    children: [
      {
        path: "/infoList",
        component: () => import("../views/landlord/InfoList.vue"),
      },
      {
        path: "/landlordSetting",
        component: () => import("../views/landlord/Setting.vue"),
      },
      {
        path: "/rentedList",
        component: () => import("../views/landlord/RentedList.vue"),
      },
      {
        path: "/rentingList",
        component: () => import("../views/landlord/RentingList.vue"),
      },
      {
        path: "/lodgerSetting",
        component: () => import("../views/lodger/Setting.vue"),
      },
      {
        path: "/lodgerRentingList",
        component: () => import("../views/lodger/InfoList.vue"),
      },
      {
        path: "/lodgerpenddingList",
        component: () => import("../views/lodger/PenddingList.vue"),
      },
      {
        path: "/lodgerRentedList",
        component: () => import("../views/lodger/RentedList.vue"),
      },
      {
        path: "/adminLandlordList",
        component: () => import("../views/admin/LandlordList.vue"),
      },
      {
        path: "/adminLodgerList",
        component: () => import("../views/admin/LodgerList.vue"),
      },
      {
        path: "/adminContractList",
        component: () => import("../views/admin/ContractList.vue"),
      },
      {
        path: "/adminRoomCheck",
        component: () => import("../views/admin/RoomCheck.vue"),
      },
      {
        path: "/adminLodgerCheck",
        component: () => import("../views/admin/LodgerCheck.vue"),
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});

export default router;
