import io from 'socket.io-client';
import { store } from '../Store';
import { writeToPersistentStore } from '../PersistentStore';

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
    store.connected = false;
  });
};

export { TryConnect, socket };
