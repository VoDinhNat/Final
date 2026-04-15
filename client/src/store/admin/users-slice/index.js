import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "@/config/api";

const initialState = {
  isLoading: false,
  userList: [],
};

export const fetchAllUsers = createAsyncThunk(
  "/users/fetchAllUsers",
  async () => {
    const result = await axios.get(
      `${API_BASE_URL}/admin/users/get`
    );

    return result?.data;
  }
);
export const createUser = createAsyncThunk(
  "/users/createUser",
  async (userData) => {
    const result = await axios.post(
      `${API_BASE_URL}/admin/users/create`,
      userData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return result?.data;
  }
);
export const updateUser = createAsyncThunk(
  "/users/updateUser",
  async ({ id, userData }) => {
    const result = await axios.put(
      `${API_BASE_URL}/admin/users/update/${id}`,
      userData
    );
    return result?.data;
  }
);

export const deleteUser = createAsyncThunk("/users/deleteUser", async (id) => {
  await axios.delete(
    `${API_BASE_URL}/admin/users/delete/${id}`
  );
  return id;
});

const AdminUsersSlice = createSlice({
  name: "adminUsers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userList = action.payload.data;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.userList = [];
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.userList.push(action.payload.data);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.userList.findIndex(
          (user) => user._id === action.payload.data._id
        );
        if (index !== -1) {
          state.userList[index] = action.payload.data;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.userList = state.userList.filter(
          (user) => user._id !== action.payload
        );
      });
  },
});

export default AdminUsersSlice.reducer;
