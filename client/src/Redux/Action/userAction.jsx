import { createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../../Api";

export const registerUserAction = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await Api.post("/auth/register", userData);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const loginUserAction = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await Api.post("/auth/login", userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const currentUserAction = createAsyncThunk(
  "auth/current-user",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await Api.post("/auth/current-user");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const userProfileAction = createAsyncThunk(
  "user/profile/:id",
  async (id, { rejectWithValue }) => {
    try {
      const response = await Api.get(`/user/profile/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const toggleBookToWishlistAction = createAsyncThunk(
  "user/wishlist/book/:id",
  async (bookId, { rejectWithValue }) => {
    try {
      const response = await Api.put(`/user/wishlist/book/${bookId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const toggleCourseToWishlistAction = createAsyncThunk(
  "user/wishlist/course/:id",
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await Api.put(`/user/wishlist/course/${courseId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const updateUserProfileAction = createAsyncThunk(
  "user/profile",
  async ({ userData }, { rejectWithValue }) => {
    try {
      const response = await Api.put("/user/profile", userData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const followUserAction = createAsyncThunk(
  "user/follow/:id",
  async (_id, { rejectWithValue }) => {
    try {
      const response = await Api.put(`/user/follow/${_id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getSuggestionsAction = createAsyncThunk(
  "user/suggestions",
  async (_id, { rejectWithValue }) => {
    try {
      const response = await Api.get("/user/suggestions");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const createProjectAction = createAsyncThunk(
  "code/create",
  async ({ data }, { rejectWithValue }) => {
    try {
      console.log("----------------------------", data);
      const response = await Api.post("/code/create", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getAllProjectAction = createAsyncThunk(
  "code/get-all",
  async (data,{ rejectWithValue }) => {
    try {
      const response = await Api.get("/code/get-all");
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const deleteProjectAction = createAsyncThunk(
  "code/delete/:id",
  async (id,{ rejectWithValue }) => {
    try {
      const response = await Api.delete(`/code/delete/${id}`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
