import type { IRootState } from '../store';

export const appLoadingSelector = (state: IRootState) => state.app.loading;

export const devicesSelector = (state: IRootState) => state.app.devices;
