import request from "..//utils/request";

export const login = (data) => {
  return request({
    url: "/login",
    method: "post",
    data,
  });
};

export const register = (data) => {
  return request({
    url: "/register",
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
export const auditHouse = (data) => {
  return request({
    url: `/audit/house`,
    method: "post",
    data,
  });
};

export const auditRent = (data) => {
  return request({
    url: `/audit/rent`,
    method: "post",
    data,
  });
};

export const agreeHouseRent = (data) => {
  return request({
    url: `/house/agree`,
    method: "post",
    data,
  });
};

export const requestHouse = (data) => {
  return request({
    url: "/house/request",
    method: "post",
    data,
  });
};

export const leaseRenewalHouse = (houseId, rentNum, type, rentTime) => {
  return request({
    url: `/house/leaseRenewal?houseId=${houseId}&rentNum=${rentNum}&type=${type}&rentTime=${rentTime}`,
    method: "post",
  });
};

export const getTenantAuditInfo = () => {
  return request({
    url: "/house/tenant/auditInfo",
    method: "get",
  });
};

export const getUserList = (params) => {
  return request({
    url: "/user/list",
    method: "get",
    params,
  });
};

export const getCurrentRentHouse = (params) => {
  return request({
    url: "/house/currentRentHouse",
    method: "get",
    params,
  });
};

export const getAdminAuditInfo = (params) => {
  return request({
    url: "/house/admin/auditInfo",
    method: "get",
    params,
  });
};

export const getAdRentHouse = () => {
  return request({
    url: "/house/admin/getRentHouse",
    method: "get",
  });
};

export const getOwnerRentHouse = () => {
  return request({
    url: "/house/owner/getRentHouse",
    method: "get",
  });
};
