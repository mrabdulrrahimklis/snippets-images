import { call, put } from "redux-saga/effects";
import { date } from "yup";
import { handleGetDorf } from "../../../../dorfinfo/state/sagas/handlers/dorfInfo";
import { setSingleUser, setUsersAdmin } from "../../store/usersSlice";
import {
  requestAssignDorfAdmin,
  requestDeleteUser,
  requestEditUser,
  requestGetSingleUser,
  requestGetUsers,
  requestRemoveDorfAdminRole,
} from "../requests/users";

export function* handleGetUsersAdmin(params) {
  try {
    const response = yield call(requestGetUsers, params.payload);
    yield put(setUsersAdmin(response.data));
  } catch (e) {
    console.log(error);
  }
}

export function* handleGetSingleUser(params) {
  try {
    const response = yield call(requestGetSingleUser, params.payload);
    const { data } = response;
    yield put(setSingleUser(data));
  } catch (error) {
    console.log(error);
  }
}

export function* handleDeleteUser(params) {
  const param = {
    payload: {
      page: params.payload.page ? params.payload.page : 1,
      limit: params.payload.limit ? params.payload.limit : 1,
      dorfId: params.payload.dorfId ? params.payload.dorfId : "",
      orderBy: "date",
      type: "descending",
    },
  };
  try {
    yield call(requestDeleteUser, params.payload.id);
    yield* handleGetUsersAdmin(param);
    if (params.payload.isSuperAdmin) {
      yield* handleGetDorf({ payload: params.payload.dorfId });
    }
  } catch (error) {
    console.log(error);
  }
}

export function* handleEditUser(params) {
  try {
    yield call(requestEditUser, params.payload);
    yield* handleGetSingleUser({ payload: params.payload.id });
  } catch (error) {
    console.log(error);
  }
}

export function* handleAssignDorfAdmin(params) {
  try {
    yield call(requestAssignDorfAdmin, params.payload);
    yield* handleGetDorf({ payload: params.payload.dorfID });
    // yield* handleGetSingleUser({ payload: params.payload.id });
  } catch (error) {
    console.log(error);
  }
}

export function* handleRemoveDorfAdminRole(params) {
  try {
    yield call(requestRemoveDorfAdminRole, params.payload);

    yield* handleGetDorf({ payload: params.payload.dorfID });
    // yield* handleGetSingleUser({ payload: params.payload.id });
  } catch (error) {
    console.log(error);
  }
}
