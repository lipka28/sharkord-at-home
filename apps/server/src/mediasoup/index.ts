import mediasoup from 'mediasoup';
import { config } from '../config.js';

let mediaSoupWorker: mediasoup.types.Worker<mediasoup.types.AppData>;

const loadMediasoup = async () => {
  mediaSoupWorker = await mediasoup.createWorker({
    rtcMaxPort: config.mediasoup.worker.rtcMaxPort,
    rtcMinPort: config.mediasoup.worker.rtcMinPort
  });

  mediaSoupWorker.on('died', () => {
    console.log('Mediasoup worker died');

    setTimeout(() => process.exit(0), 2000);
  });

  console.log('Mediasoup worker loaded');
};

export { loadMediasoup, mediaSoupWorker };
