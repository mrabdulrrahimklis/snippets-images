import { createSlice } from "@reduxjs/toolkit";

const usersSlice = createSlice({
  name: "users",
  initialState: {
    page: 0,
    total: 0,
    limit: 0,
    pages: 0,
  },
  reducers: {
    getUsersAdmin(params) {},
    setUsersAdmin(state, action) {
      return {
        ...state,
        listOfUsersAdmin: action.payload,
      };
    },
    deleteUser(params) {},
    assignDorfAdmin(params) {},
    removeDorfAdmin(params) {},
    getSingleUser(params) {},
    setSingleUser(state, action) {
      return { ...state, singleUser: action.payload };
    },
    editUser(params) {},
  },
});

export const {
  getUsersAdmin,
  setUsersAdmin,
  deleteUser,
  getSingleUser,
  setSingleUser,
  editUser,
  assignDorfAdmin,
  removeDorfAdmin,
} = usersSlice.actions;

export default usersSlice.reducer;
