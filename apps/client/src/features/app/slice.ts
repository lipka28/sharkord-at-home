import type { TDevices } from '@/types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface TAppState {
  loading: boolean;
  devices: TDevices | undefined;
}

const initialState: TAppState = {
  loading: true,
  devices: undefined
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAppLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setDevices: (state, action: PayloadAction<TDevices>) => {
      state.devices = action.payload;
    }
  }
});

const appSliceActions = appSlice.actions;
const appSliceReducer = appSlice.reducer;

export { appSliceActions, appSliceReducer };
