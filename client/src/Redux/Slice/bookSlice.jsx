import { toast } from "react-toastify";

import { createSlice } from "@reduxjs/toolkit";
import { acceptBookSuggestionAction, addCommentBookAction, createBookAction, deleteBookAction, getAllBookAction, getBooksSuggestions, updateBookAction, updateBookRateByIdAction } from "../Action/bookAction";
const bookSlice = createSlice({
  name: "book",
  initialState: {
    book: null,
    books: [],
    suggestions:[],
    getBok: null,
    loading: false,
    createBookLoading:false,
    acceptBookSuggestionLoading:false,
    error: null,
    success: true,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    
      .addCase(createBookAction.pending, (state) => {
        state.createBookLoading = true;
        state.error = null;
      })
      .addCase(createBookAction.fulfilled, (state) => {
        state.createBookLoading = false;
        state.success = true;
      })
  
      .addCase(getBooksSuggestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBooksSuggestions.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = true;
        state.suggestions = payload.data;
      })
      .addCase(acceptBookSuggestionAction.pending, (state) => {
        state.acceptBookSuggestionLoading = true;
        state.error = null;
      })
      .addCase(acceptBookSuggestionAction.fulfilled, (state, { payload }) => {
        state.acceptBookSuggestionLoading = false;
        state.success = true;
      })
 
      .addCase(getAllBookAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllBookAction.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = true;
        state.books = payload.data;
      })

      .addCase(updateBookRateByIdAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBookRateByIdAction.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(updateBookAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBookAction.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(deleteBookAction.pending, (state) => {
        state.deleteBookLoading = true;
        state.error = null;
      })
      .addCase(deleteBookAction.fulfilled, (state, { payload }) => {
        state.deleteBookLoading = false;
        state.success = true;
      })
      .addCase(addCommentBookAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCommentBookAction.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = true;
      })

      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, { payload }) => {
       
          state.loading = false;
          state.createBookLoading = false;
          state.acceptBookSuggestionLoading = false;
   let error = payload?.error;
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
