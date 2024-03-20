import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   user: null,
   error: null,
   loading: false,
};

const userSlice = createSlice({
   name: "user",
   initialState,
   reducers: {
      signInStart: (state) => {
         state.loading = true;
         state.error = null;
      },
      signInSucess: (state, action) => {
         state.user = action.payload;
         state.error = null;
         state.loading = false;
      },
      signInFailure: (state, action) => {
         state.error = action.payload;
         state.loading = false;
      },
      updateStart: (state, action) => {
         state.error = null;
         state.loading = true;
      },
      updateSucess: (state, action) => {
         state.user = action.payload;
         state.error = null;
         state.loading = false;
      },
      updateFaliure: (state, action) => {
         state.error = action.payload;
         state.loading = false;
      },
      deleteUserStart: (state) => {
         state.error = null;
         state.loading = true;
      },
      deleteUserSuccess: (state) => {
         state.user = null;
         state.error = null;
         state.loading = false;
      },
      deleteUserFaliure: (state, action) => {
         state.error = action.payload;
         state.loading = false;
      },
      singOutSuccess: (state) => {
         state.user = null;
         state.error = null;
         state.loading = false;
      },
   },
});

// exporting the actions
export const {
   signInStart,
   signInSucess,
   signInFailure,
   updateStart,
   updateFaliure,
   updateSucess,
   deleteUserStart,
   deleteUserSuccess,
   deleteUserFaliure,
   singOutSuccess,
} = userSlice.actions;

// exporting the reducer
export default userSlice.reducer;
