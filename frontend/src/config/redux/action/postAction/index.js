import { createAsyncThunk } from "@reduxjs/toolkit"
import { clientServer } from "@/config"

export const getAllposts = createAsyncThunk(
  "post/getAllposts",
  async (_, thunkAPI) => {
    try {
      const response = await clientServer.get("/posts")
      return response.data
    } catch (e) {
      return thunkAPI.rejectWithValue(
        e.response?.data?.message || e.message || "Something went wrong"
      )
    }
  }
)