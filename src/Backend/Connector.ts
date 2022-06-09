import io from 'socket.io-client';
import { store } from '../Store';
import { writeToPersistentStore } from '../PersistentStore';
import { settingsStore } from '../StoreSettings';

let socket: any;

const TryConnect = () => {
  socket = io(`http://${store.ip}:3000`);
  socket.on('connect', function () {
    console.log('connected');
    store.connected = true;
    store.previousIP = store.ip;
    writeToPersistentStore('previousIP', store.ip);
  });
  socket.on('disconnect', function () {
    Disconnect();
  });
};

const Disconnect = () => {
  socket.emit('drive', 0);
  socket.emit('steer', settingsStore.steeringCenter);
  store.ip = '';
  store.connected = false;
  socket.disconnect();
  socket = null; // destroy the socket
};

export { TryConnect, Disconnect, socket };
