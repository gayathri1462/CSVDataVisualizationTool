import { createSlice } from "@reduxjs/toolkit";

const stepsSlice = createSlice({
  name: "steps",
  initialState: {
    data: {
      csvUpload: null,
      viewData: null,
      visualizeData: null
    },
    currentIndex: 0
  },
  reducers: {
    updateStepsStatus: (state, action) => {
      return {
        ...state,
        data: {
          ...state.data,
          ...action.payload
        }
      };
    },
    setCurrentIndex: (state, action) => {
      return {
        ...state,
        currentIndex: action.payload
      };
    }
  }
});

export const { updateStepsStatus, setCurrentIndex } = stepsSlice.actions;

export default stepsSlice.reducer;
