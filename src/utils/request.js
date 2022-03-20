import axios from "axios";

const service = axios.create({
  // process.env.NODE_ENV === 'development' 来判断是否开发环境
  baseURL: "/api",
  timeout: 30000,
});

service.interceptors.request.use(
  (config) => {
    const userId =
      localStorage.getItem("userInfo") &&
      JSON.parse(localStorage.getItem("userInfo")).userId;
    if (userId) {
      // 添加headers
      config.headers.userId = userId;
      config.headers["content-type"] = "application/json;charset=UTF-8";
    }
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject();
  }
);

service.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      return response.data;
    } else {
      Promise.reject();
    }
  },
  (error) => {
    console.log(error);
    return Promise.reject();
  }
);

export default service;
