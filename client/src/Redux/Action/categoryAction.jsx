import { createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../../Api";

export const createCategoryAction = createAsyncThunk(
    "categories/create",
    async (categoryData, { rejectWithValue }) => {
      try {
     
        const response = await Api.post("/category/create", categoryData  ,{
          headers: { "Content-Type": "multipart/form-data" },
        });
       
        return response.data;
      } catch (error) {
        
        return rejectWithValue(error.response.data);
      }
    }
  );
export const updateCategoryAction = createAsyncThunk(
    "categories/update",
    async ({id,categoryData}, { rejectWithValue }) => {
      try {
        const response = await Api.put(`/category/update/${id}`, categoryData  ,{
          headers: { "Content-Type": "multipart/form-data" },
        });
       
        return response.data;
      } catch (error) {
        
        return rejectWithValue(error.response.data);
      }
    }
  );
export const getAllCategoriesAction = createAsyncThunk(
    "categories/get-all",
    async (empty,{ rejectWithValue }) => {
      try {
        const response = await Api.get("/category/get-all" );
        return response.data;
      } catch (error) {
       
        return rejectWithValue(error.response.data);
      }
    }
  );
export const deleteCategoryAction = createAsyncThunk(
    "categories/delete/:id",
    async (id, { rejectWithValue }) => {
      try {
        const response = await Api.delete(`/category/delete/${id}` );
        return response.data;
      } catch (error) {
       
        return rejectWithValue(error.response.data);
      }
    }
  );