import { combineReducers } from "redux";
import stepsSlice from "./steps/stepsSlice";
import csvDataSlice from "./csvData/csvDataSlice";

const rootReducer = combineReducers({
  stepsInfo: stepsSlice,
  csvInfo: csvDataSlice
});

export default rootReducer;
