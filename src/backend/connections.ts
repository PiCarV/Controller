import { store } from '../Store';
import { io } from 'socket.io-client';
import persistentStore from '../PersistentStore';

const TryConnect = () => {
  let socket = io(`http://${store.ip}:3000`);
  socket.on('connect', function () {
    console.log('connected');
    store.connected = true;
    // we now know that we are connected so we can save the ip address
    store.previousIP = store.ip;
    persistentStore.set('previousIP', store.ip);
  });
  socket.on('disconnect', function () {
    store.connected = false;
  });

  return socket;
};

export default TryConnect;
