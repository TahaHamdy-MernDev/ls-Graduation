import { toast } from "react-toastify";
import { createSlice } from "@reduxjs/toolkit";
import {
  createCategoryAction,
  deleteCategoryAction,
  getAllCategoriesAction,
  updateCategoryAction,
} from "../Action/categoryAction";
const bookSlice = createSlice({
  name: "category",
  initialState: {
    category: null,
    categories: [],
    getCategory: null,
    updateLoading:false,
    createLoading:false,
    deleteLoading:false,
    loading: false,
    error: null,
    success: true,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCategoryAction.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createCategoryAction.fulfilled, (state) => {
        state.createLoading = false;
        state.success = true;
      })
      .addCase(updateCategoryAction.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateCategoryAction.fulfilled, (state) => {
        state.updateLoading = false;
        state.success = true;
    
      })
     
      .addCase(getAllCategoriesAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCategoriesAction.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = true;
        
        state.categories = payload.data;
      })
 .addCase(deleteCategoryAction.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteCategoryAction.fulfilled, (state) => {
        state.deleteLoading = false;
        state.success = true;
    
      })
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, { payload }) => {
          state.loading = false;
          state.updateLoading=false
          state.createLoading=false
          state.deleteLoading=false
          let error = payload.error
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
export default bookSlice.reducer;
