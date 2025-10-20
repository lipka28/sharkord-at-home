import { useSelector } from 'react-redux';
import { appLoadingSelector, devicesSelector } from './selectors';

export const useIsAppLoading = () => useSelector(appLoadingSelector);

export const useDevices = () => useSelector(devicesSelector);
