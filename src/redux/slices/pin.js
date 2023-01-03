import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import PinService from "services/pinService";

const initialState = {};

const pinSlice = createSlice({
  name: "pin",
  initialState,
  reducers: {
    // getPinFeed
    getPinFeedLoading: (state, action) => {
      return {
        loading: true,
        error: null,
        data: [],
      };
    },
    getPinFeedSuccess: (state, action) => {
      return {
        loading: false,
        error: null,
        data: action.payload,
      };
    },
    getPinFeedError: (state, action) => {
      return {
        loading: false,
        error: action.payload,
        data: [],
      };
    },
    // getPinById
    getPinByIdLoading: (state, action) => {
      return {
        loading: true,
        error: null,
        data: [],
      };
    },
    getPinByIdSuccess: (state, action) => {
      return {
        loading: false,
        error: null,
        data: action.payload,
      };
    },
    getPinByIdError: (state, action) => {
      return {
        loading: false,
        error: action.payload,
        data: [],
      };
    },
    // savePin
    savePinLoading: (state, action) => {
      return {
        loading: true,
        error: null,
        data: [],
      };
    },
    savePinSuccess: (state, action) => {
      return {
        loading: false,
        error: null,
        data: action.payload,
      };
    },
    savePinError: (state, action) => {
      return {
        loading: false,
        error: action.payload,
        data: [],
      };
    },
  },
});

const { reducer } = pinSlice;
const {
  getPinFeedLoading,
  getPinFeedSuccess,
  getPinFeedError,
  savePinLoading,
  savePinSuccess,
  savePinError,
  getPinByIdLoading,
  getPinByIdSuccess,
  getPinByIdError,
} = pinSlice.actions;
const PinSlices = {
  reducer,
  getPinFeedLoading,
  getPinFeedSuccess,
  getPinFeedError,
  savePinLoading,
  savePinSuccess,
  savePinError,
  getPinByIdLoading,
  getPinByIdSuccess,
  getPinByIdError,
};
export default PinSlices;
