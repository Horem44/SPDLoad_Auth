import {
  createSlice,
} from "@reduxjs/toolkit";
import  RootState from "./index";

interface authSlice {
  isAuth: boolean;
}

const initialAuthState: authSlice = {
  isAuth: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    login: (state) => {
      state.isAuth = true;
    },
    logout: (state) => {
      state.isAuth = false;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice;
