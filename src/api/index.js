import request from "..//utils/request";

export const login = (data) => {
  return request({
    url: "/login",
    method: "post",
    data,
  });
};

export const getUser = () => {
  return request({
    url: "/user",
    method: "get",
  });
};

export const modifyUser = (data) => {
  return request({
    url: "/user",
    method: "put",
    data,
  });
};

export const getHouse = (params) => {
  return request({
    url: "/house",
    method: "get",
    params,
  });
};

export const upHouse = (data) => {
  return request({
    url: "/house",
    method: "post",
    data,
  });
};

export const modifyHouse = (id, data) => {
  return request({
    url: `/house/${id}`,
    method: "put",
    data,
  });
};

export const delHouse = (id) => {
  return request({
    url: `/house/${id}`,
    method: "delete",
  });
};

export const getHouseRent = () => {
  return request({
    url: `/house/rent`,
    method: "get",
  });
};

export const agreeHouseRent = (data) => {
  return request({
    url: `/house/agree`,
    method: "post",
    data,
  });
};
