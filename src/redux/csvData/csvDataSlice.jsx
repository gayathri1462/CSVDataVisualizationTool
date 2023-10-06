import { createSlice } from "@reduxjs/toolkit";

const csvDataSlice = createSlice({
  name: "csvUpload",
  initialState: {
    csvData: null,
    spreadSheetData: null,
    file: null
  },
  reducers: {
    setUploadedFile: (state, action) => {
      return {
        ...state,
        ...action.payload
      };
    }
  }
});

export const { setUploadedFile } = csvDataSlice.actions;

export default csvDataSlice.reducer;
