import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const clientServer = axios.create({
  baseURL: "http://localhost:9090",
});

export const loginUser = createAsyncThunk(
  "user/login",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post("/login", {
        email: user.email,
        password: user.password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        return response.data.token;
      } else {
        return thunkAPI.rejectWithValue({ message: "token not provided" });
      }
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || { message: err.message }
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  "user/register",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post("/register", {
        name: user.name,
        email: user.email,
        password: user.password,
        username: user.username,
      });

      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || { message: err.message }
      );
    }
  }
);

export const getAboutUser = createAsyncThunk(
  "user/getAboutUser",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.get("/get_user_and_profile", {
        params: {
          token: user.token,
        },
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || { message: err.message }
      );
    }
  }
);

export const getAllUsers = createAsyncThunk(
  "user/getAllUsers",
  async(_,thunkAPI) =>{
    try{
  
      const response = await clientServer.get("/user/get_all_users")
return tahukAPI.fulfillWithValue(response.data)
    }catch (err){
  return thunkAPI.rejectWithValue(err.response.data)
    }
  }
)