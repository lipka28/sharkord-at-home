import os from 'os';

const getPrivateIp = async () => {
  const interfaces = os.networkInterfaces();
  const addresses = Object.values(interfaces)
    .flat()
    .filter((iface) => iface?.family === 'IPv4' && !iface.internal)
    .map((iface) => iface?.address);

  return addresses[0];
};

const getPublicIp = async () => {
  const response = await fetch('https://api.ipify.org?format=json');
  const data = (await response.json()) as {
    ip: string;
  };

  return data.ip;
};

export { getPrivateIp, getPublicIp };
