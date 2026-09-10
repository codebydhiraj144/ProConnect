import { createSlice } from '@reduxjs/toolkit';
import { getAllposts } from '../../action/postAction'; // adjust path to match your folder structure

const initialState = {
  posts: [],
  isError: false,
  postfetched: false,
  isloggedin: false,
  comments: [],
  isLoading: false,
  message: '',
  postId: "",
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    reset: () => initialState,
    resetpostId: (state) => {
      state.postId = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllposts.pending, (state) => {
        state.isLoading = true;
        state.message = 'knocking the door';
      })
      .addCase(getAllposts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.postfetched = true;
        state.posts = action.payload.posts;
      })
      .addCase(getAllposts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, resetpostId } = postSlice.actions;
export default postSlice.reducer;