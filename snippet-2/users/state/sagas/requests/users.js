import { apiService } from "../../../../../core/services/apiService";

export function requestGetUsers(params) {
  const mire = apiService.get(
    `admin/users/village/${params.dorfId}?page=${params.page}&limit=${params.limit}&orderBy=${params.orderBy}&type=${params.type}`
    // `/user/from-vilage?page=${params.page}&limit=${params.limit}&dorfId=${params.dorfId}&orderBy=${params.orderBy}&type=${params.type}`
  );
  mire.then((data) => console.log("mire", data));
  return mire;
}

export function requestGetSingleUser(params) {
  return apiService.get(`user/${params}`);
}

export function requestDeleteUser(params) {
  return apiService.delete(`admin/user/${params}`);
}

export function requestEditUser(payload) {
  return apiService.put(`user/${payload.id}`, payload.formData);
}

export function requestAssignDorfAdmin(params) {
  return apiService.post(`auth/assign-dorfadmin/${params.id}`);
}

export function requestRemoveDorfAdminRole(params) {
  return apiService.post(
    `auth/remove-dorfadmin-role/${params.id}?role=${params.role}`
  );
}
