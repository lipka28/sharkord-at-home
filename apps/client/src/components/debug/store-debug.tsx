import type { IRootState } from '@/features/store';
import { useSelector } from 'react-redux';

const StoreDebug = () => {
  const server = useSelector((state: IRootState) => state.server);

  if (window.DEBUG) {
    console.log('# State server ', server);
  }

  return null;
};

export { StoreDebug };
