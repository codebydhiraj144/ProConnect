import { createSlice } from '@reduxjs/toolkit'
import { loginUser, registerUser, getAboutUser,getAllUsers } from '@/config/redux/action/authAction'

const initialState = {
  isTokenThere: false,
  profileFetched: false,
  connections: [],
  connectionRequest: [],
  all_users: [],
  user: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  loggedIn: false,
  message: '',
  all_profiles_fetched: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: () => initialState,
    handleLoginUser: (state) => {
      state.message = 'hello'
    },
    emptyMessage: (state) => {
      state.message = ''
    },
    setTokenIsThere: (state) => {
      state.isTokenThere = true
    },
    setTokenIsNotThere: (state) => {
      state.isTokenThere = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.isError = false
        state.message = 'knocking the door'
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isError = false
        state.isSuccess = true
        state.loggedIn = true
        state.user = action.payload
        state.message = 'login success'
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true
        state.isError = false
        state.message = 'Registering you'
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false
        state.isError = false
        state.isSuccess = true
        state.loggedIn = false
        state.message = 'Registered is successfull, please login'
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getAboutUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isError = false
        state.profileFetched = true
        state.user = action.payload.profile
        state.connections = action.payload.connections || []
        state.connectionRequest = action.payload.connectionRequest || []
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false
        state.isError = false
        state.all_profiles_fetched = true
        state.all_users = action.payload.profiles
      })
  },
})

export const {
  reset,
  handleLoginUser,
  emptyMessage,
  setTokenIsThere,
  setTokenIsNotThere,
} = authSlice.actions

export default authSlice.reducer