import { createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../../Api";

export const createBookAction = createAsyncThunk(
  "books/create",
  async (bookData, { rejectWithValue }) => {
    try {
      const response = await Api.post("/books/create", bookData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getAllBookAction = createAsyncThunk(
  "books/get-all",
  async (bookData, { rejectWithValue }) => {
    try {
      const response = await Api.get("/books/get-all");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


export const updateBookRateByIdAction = createAsyncThunk(
  "books/:id",
  async ({ _id, rating }, { rejectWithValue }) => {
    try {
      const response = await Api.put(`/books/${_id}`, {rating});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getBooksSuggestions = createAsyncThunk(
  "books/get-suggestions",
  async (bookData, { rejectWithValue }) => {
    try {
      const response = await Api.get("/books/get-suggestions");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const acceptBookSuggestionAction = createAsyncThunk(
  "books/accept/:id",
  async ({ _id}, { rejectWithValue }) => {
    try {
      const response = await Api.put(`/books/accept/${_id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const updateBookAction = createAsyncThunk(
  "books/update/:id",
  async ({ bookId, bookData }, { rejectWithValue }) => {
    try {
      const response = await Api.patch(`/books/update/${bookId}`, bookData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const deleteBookAction = createAsyncThunk(
  "books/delete/:id",
  async (bookId, { rejectWithValue }) => {
    try {
      const response = await Api.delete(`/books/delete/${bookId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const addCommentBookAction = createAsyncThunk(
  "books/leave-comment/:id",
  async ({bookId,comment}, { rejectWithValue }) => {
    try {
      const response = await Api.post(`/books/leave-comment/${bookId}`,{text:comment});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const downloadsCountAction = createAsyncThunk(
  "books/download/:id",
  async (id, { rejectWithValue }) => {
    try {
      const response = await Api.post(`/books/download/${id.bookId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
