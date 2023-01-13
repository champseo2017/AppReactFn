import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {};

const createPin = createSlice({
  name: "createPin",
  initialState,
  reducers: {
    // createPin
    createPinLoading: (state, action) => {
      return {
        loading: true,
        error: null,
        data: [],
      };
    },
    createPinSuccess: (state, action) => {
      return {
        loading: false,
        error: null,
        data: action.payload,
      };
    },
    createPinError: (state, action) => {
      return {
        loading: false,
        error: action.payload,
        data: [],
      };
    },
  },
});

const { reducer } = createPin;
const {
  createPinLoading,
  createPinSuccess,
  createPinError,
} = createPin.actions;
const CreatePinSlices = {
  reducer,
  createPinLoading,
  createPinSuccess,
  createPinError,
};
export default CreatePinSlices;
