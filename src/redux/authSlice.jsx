import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth slice",
  initialState: { 
    value: false,
    primaryColor: '', 
    secondaryColor: '',
    thirdColor: '',
    fourthColor: ''
  },
  reducers: {
    triger: (state, action) => {
      state.value = action.payload;
    },
    colorTheme: (state, action) => {
      state.primaryColor = action.payload.primaryColor;
      state.secondaryColor = action.payload.secondaryColor;
      state.thirdColor = action.payload.thirdColor;
      state.fourthColor = action.payload.fourthColor;
    },
  },
});

export const { triger , colorTheme} = authSlice.actions;

export default authSlice.reducer;
