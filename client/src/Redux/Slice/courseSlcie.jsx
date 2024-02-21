import { toast } from "react-toastify";

import { createSlice } from "@reduxjs/toolkit";
import { acceptCourseSuggestionAction, createCourseAction, deleteCourseByIdAction, fetchCoursesAction, getCoursesSuggestions, updateCourseByIdAction, updateCourseRateByIdAction } from "../Action/courseAction";
const courseSlice = createSlice({
  name: "course",
  initialState: {
    course: null,
    courses: [],
    suggestions:[],
    getCourses: null,
    loading:false,
    addCourseLoading: false,
    editCourseLoading: false,
    deleteLoading: false,
    fetchCourseLoading: false,
    updateCourseRateLoading: false,
    getCoursesSuggestionsLoading: false,
    acceptCourseSuggestionActionLoading: false,
    error: null,
    success: true,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCourseAction.pending, (state) => {
        state.addCourseLoading = true;
        state.error = null;
      })
      .addCase(createCourseAction.fulfilled, (state) => {
        state.addCourseLoading = false;
        state.success = true;
      })
      .addCase(updateCourseRateByIdAction.pending, (state) => {
        state.updateCourseRateLoading = true;
        state.error = null;
      })
      .addCase(updateCourseRateByIdAction.fulfilled, (state) => {
        state.updateCourseRateLoading = false;
        state.success = true;
      })
      .addCase(fetchCoursesAction.pending, (state) => {
        state.fetchCourseLoading = true;
        state.error = null;
      })
      .addCase(fetchCoursesAction.fulfilled, (state, { payload }) => {
        state.fetchCourseLoading = false;
        state.success = true;
        state.courses = payload.data;
      })
      .addCase(getCoursesSuggestions.pending, (state) => {
        state.getCoursesSuggestionsLoading = true;
        state.error = null;
      })
      .addCase(getCoursesSuggestions.fulfilled, (state, { payload }) => {
        state.getCoursesSuggestionsLoading = false;
        state.success = true;
        state.suggestions = payload.data;
      })
      .addCase(acceptCourseSuggestionAction.pending, (state) => {
        state.acceptCourseSuggestionActionLoading = true;
        state.error = null;
      })
      .addCase(acceptCourseSuggestionAction.fulfilled, (state, { payload }) => {
        state.acceptCourseSuggestionActionLoading = false;
        state.success = true;

      })
      .addCase(updateCourseByIdAction.pending, (state) => {
        state.editCourseLoading = true;
        state.error = null;
      })
      .addCase(updateCourseByIdAction.fulfilled, (state, { payload }) => {
        state.editCourseLoading = false;
        state.success = true;
      })
      .addCase(deleteCourseByIdAction.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteCourseByIdAction.fulfilled, (state, { payload }) => {
        state.deleteLoading = false;
        state.success = true;
      })
      .addMatcher((action) => action.type.endsWith("/rejected"),(state, { payload }) => {
        state.addCourseLoading =false
        state.deleteLoading =false
        
          state.loading = false;
          state.getCoursesSuggestionsLoading = false;
          state.acceptCourseSuggestionActionLoading = false;
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
export default courseSlice.reducer;
