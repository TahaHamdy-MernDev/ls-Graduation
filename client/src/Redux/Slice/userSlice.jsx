import { toast } from "react-toastify";
import {
  createProjectAction,
  currentUserAction,
  deleteProjectAction,
  followUserAction,
  getAllProjectAction,
  getSuggestionsAction,
  loginUserAction,
  registerUserAction,
  toggleBookToWishlistAction,
  toggleCourseToWishlistAction,
  updateUserProfileAction,
  userProfileAction,
} from "../Action/userAction";
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
    users: [],
    suggestions:[],
    getUser: null,
    followUserLoading: false,
    createProjectLoading: false,
    projects :[],
    loading: false,
    error: null,
    success: true,
    deleteProjectLoading:false,
    isAuthenticated: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(currentUserAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(currentUserAction.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = true;
        state.isAuthenticated = true;
        state.currentUser = payload.data;
      })
      .addCase(loginUserAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserAction.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = true;
        state.isAuthenticated = true;
        state.currentUser = payload.data;
      })
      .addCase(registerUserAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUserAction.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(userProfileAction.pending, (state, { payload }) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userProfileAction.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = true;
        state.getUser = payload.data;
      })
      .addCase(updateUserProfileAction.pending, (state, { payload }) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfileAction.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = true;
        state.getUser = payload.data;
      })
      .addCase(toggleBookToWishlistAction.pending, (state, { payload }) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleBookToWishlistAction.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = true;
        state.currentUser = payload.data;
      })
      .addCase(toggleCourseToWishlistAction.pending, (state, { payload }) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleCourseToWishlistAction.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = true;
        state.currentUser = payload.data;
      })
      .addCase(followUserAction.pending, (state, { payload }) => {
        state.followUserLoading = true;
        state.error = null;
      })
      .addCase(followUserAction.fulfilled, (state, { payload }) => {
        state.followUserLoading = false;
        state.success = true;
      })
      .addCase(getSuggestionsAction.pending, (state, { payload }) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSuggestionsAction.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = true;
        state.suggestions = payload.data;
      })
      .addCase(createProjectAction.pending, (state, { payload }) => {
        state.createProjectLoading = true;
        state.error = null;
      })
      .addCase(createProjectAction.fulfilled, (state, { payload }) => {
        state.createProjectLoading = false;
        state.success = true;
      })
      .addCase(getAllProjectAction.pending, (state, { payload }) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllProjectAction.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = true;
        state.projects = payload.data;
      })
      .addCase(deleteProjectAction.pending, (state, { payload }) => {
        state.deleteProjectLoading = true;
        state.error = null;
      })
      .addCase(deleteProjectAction.fulfilled, (state, { payload }) => {
        state.deleteProjectLoading = false;
        state.success = true;
      })
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, { payload }) => {
      
          state.loading = false;
          state.followUserLoading=false
          state.createProjectLoading=false 
          state.deleteProjectLoading = false
             let error = payload?.message;
          if (error) {
            if (Array.isArray(error)) {
              error.forEach((err) => toast.error(err.message));
            } else if (error.success === false && error.message) {
              state.error = error.message;
              state.success = error.success;
            } else {
              state.error = "An unknown error occurred";
            }
          } else {
            state.error = "Network error occurred";
          }
        }
      );
  },
});
export default userSlice.reducer;
